import _ from "lodash";
import { BehaviorSubject, concatMap, filter, findIndex, from, of } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";
import { z } from "zod";

const toastSchema = z.object({
  data: z
    .union([
      z.object({
        mode: z.literal("success"),
        status: z.number().optional(),
        message: z.string().optional(),
      }),
      z.object({
        mode: z.literal("normal-error"),
        status: z.number().optional(),
        message: z.union([z.string(), z.object({})]).optional(),
      }),
      z.object({
        mode: z.literal("custom-error"),
        status: z.number().optional(),
        message: z
          .object({
            code: z.number().min(1000).max(9000),
            key: z.string(),
            message: z.string().optional(),
          })
          .array(),
      }),
      z.object({
        mode: z.literal("custom"),
        status: z.number().optional(),
        message: z
          .union([
            z.string(),
            z.string().array(),
            z.object({}),
            z
              .object({
                code: z.number().min(1000).max(9000),
                key: z.string(),
                message: z.string(),
              })
              .array(),
          ])
          .optional(),
      }),
    ])
    .and(z.object({})),
  title: z.string(),
  save: z
    .union([z.literal("YES"), z.literal("NO"), z.literal("NOW")])
    .optional(),
});

const entryToastSchema = z.union([
  z
    .object({
      type: z.literal("add"),
      date: z.date(),
    })
    .and(toastSchema),

  z.object({
    type: z.literal("delete"),
  }),
  z.object({
    type: z.literal("close"),
  }),
  z.object({
    type: z.literal("update"),
  }),
  z
    .object({
      type: z.literal("save"),
      date: z.date(),
    })
    .and(toastSchema),
]);

const outputToastSchema = entryToastSchema.and(
  z.object({
    id: z.uuid(),
  }),
);

const pendingToastList = ref<z.infer<typeof outputToastSchema>[]>([]);
const savedToastList = ref<z.infer<typeof outputToastSchema>[]>([]);
const activeToastList = ref<z.infer<typeof outputToastSchema>[]>([]);
const savedToastListLimit = 50;
const activeToastListLimit = 4;
const showTime = 6000;
const savedToastStorageName = "saved:toasts";
const hookOfToast = new BehaviorSubject<
  z.infer<typeof outputToastSchema> | undefined
>(undefined);

const hookOfAddToast = (toast: z.infer<typeof toastSchema>) => {
  const uuid = uuidv4();
  hookOfToast.next({
    save: "NO",
    ...toast,
    id: uuid,
    type: "add",
    date: new Date(),
  });
};
const hookOfRemoveToast = (id: string) => {
  hookOfToast.next({ type: "delete", id });
};
const hookOfCloseToast = (id: string) => {
  hookOfToast.next({ type: "close", id });
};

const hookOfUpdateToast = (id: string) => {
  // _.delay(() => {
  hookOfToast.next({ type: "update", id });
  // }, 500);
};
const hookOfSaveToast = (
  toast: z.infer<typeof toastSchema> & { id: string; type: any },
) => {
  hookOfToast.next({ ...toast, type: "save" as any });
};

const getSavedStorage = () => {
  let savedStorage = localStorage.getItem(savedToastStorageName);
  if (savedStorage) {
    return JSON.parse(savedStorage) as z.infer<typeof outputToastSchema>[];
  } else {
    return [];
  }
};

const loadSavedToastList = () => {
  let savedStorage = getSavedStorage();
  savedToastList.value = savedStorage;
};

const updateSavedStorage = () => {
  let limited = _.takeRight(savedToastList.value, savedToastListLimit);
  localStorage.setItem(savedToastStorageName, JSON.stringify(limited));
};

const saveActiveToast = (id: string) => {
  const findedToast = _.findIndex(activeToastList.value, { id });
  if (findedToast !== -1) {
    _.set(activeToastList.value, `[${findedToast}].save`, "NOW");
    // @ts-ignore
    hookOfToast.next({ ...activeToastList.value[findedToast], type: "save" });
  }
};

const install = () => {
  loadSavedToastList();
  hookOfToast.subscribe((observer) => {
    if (observer) {
      if (observer.type == "save") {
        savedToastList.value.push(observer);
        savedToastList.value = _.uniqBy(savedToastList.value, "id");
        updateSavedStorage();
        hookOfUpdateToast(observer.id);
      } else if (observer.type == "delete") {
        _.remove(savedToastList.value, { id: observer.id });
        // let finded = _.findIndex(savedToastList.value, { id: observer.id });
        // savedToastList.value.splice(finded, 1);
        updateSavedStorage();
      } else if (observer.type == "close") {
        _.remove(activeToastList.value, { id: observer.id });
        // let finded = _.findIndex(activeToastList.value, { id: observer.id });
        // activeToastList.value.splice(finded, 1);
        _.delay(() => {
          let toasts = _.take(pendingToastList.value, activeToastListLimit);
          toasts.forEach((item) => {
            hookOfUpdateToast(item.id);
          });
        }, 1500);
      } else if (observer.type == "update") {
        let toast = _.find(pendingToastList.value, { id: observer.id });
        if (toast) {
          if (activeToastList.value.length < activeToastListLimit) {
            activeToastList.value.push(toast);
            _.remove(pendingToastList.value, { id: observer.id });
            // let finded = _.findIndex(pendingToastList.value, { id: observer.id });
            // pendingToastList.value.splice(finded, 1);
            _.delay(() => {
              hookOfCloseToast(observer.id);
            }, showTime);
          } else {
            console.log("Limit On Push To Active List");
          }
        } else {
          console.log("not founded toast");
        }
      } else {
        pendingToastList.value.push(observer);
        if (observer.save == "YES" || observer.save == "NOW") {
          hookOfSaveToast(observer);
        } else {
          hookOfUpdateToast(observer.id);
        }
      }
    }
  });
};

const useActiveToastList = computed(() => {
  let filtered = activeToastList.value.filter((item) => {
    return item.type == "add";
  });
  return filtered.map((item) => {
    if (item.type == "add") {
      return {
        id: item.id,
        save: item.save,
        date: item.date,
        title: item.title,
        data: item.data,
      };
    } else {
      return {
        id: "",
        save: true,
        date: new Date(),
        title: "",
        data: {
          mode: "custom",
          message: "",
          status: 200,
        },
      };
    }
  });
});

const useSavedToastList = computed(() => {
  let filtered = savedToastList.value.filter((item) => {
    return item.type == "add";
  });
  return filtered.map((item) => {
    if (item.type == "add") {
      return {
        id: item.id,
        save: item.save,
        date: item.date,
        title: item.title,
        data: item.data,
      };
    } else {
      return {
        id: "",
        save: true,
        date: new Date(),
        title: "",
        data: {
          mode: "custom",
          message: "",
          status: 200,
        },
      };
    }
  });
});
export default {
  install,
  add: hookOfAddToast,
  activeToastList,
  useActiveToastList,
  close: hookOfCloseToast,
  savedToastList,
  useSavedToastList,
  remove: hookOfRemoveToast,
  showTime,
  saveActiveToast,
};
