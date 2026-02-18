import _ from "lodash";
import { computed, ref, type Ref } from "vue";
import type { DataTableHeader } from "vuetify";
import type { ItemType } from "vuetify/lib/components/VDataTable/VDataTableServer.mjs";
import type { ZodObject, z } from "zod";

export type IOnUpdateTableOptions = {
  page: 1;
  itemsPerPage: 10;
  sortBy: [];
  groupBy: [];
  hasMore: boolean;
};

export type IResponseShape = {
  page: number;
  totalCounts: number;
  hasMore: boolean;
  pageSize: number;
  totalPages: number;
};

type AnyObject = {
  [key: string]: any;
};

type IEntryMakeTableOptions = {
  page: number;
  pageSize: number;
  search: string;
};

type IEntryTableHeaders<ITEM> = DataTableHeader<ItemType<ITEM[]>> & {
  visible?: boolean;
};
type IEntryTableHeadersSecond<ITEM> = DataTableHeader<ItemType<ITEM[]>>;
type IOutputTableHeader<ITEM> = DataTableHeader<ItemType<ITEM[]>>;

export const useTableService = <
  ITEM_SCHEMA extends ZodObject,
  ITEM extends z.infer<ITEM_SCHEMA>,
>(
  schema: ITEM_SCHEMA,
) => {
  const makeTableOptions = (
    entryOptions: Partial<IEntryMakeTableOptions> = {},
  ) => {
    const options: IEntryMakeTableOptions = {
      page: 1,
      pageSize: 10,
      search: "",
      ...entryOptions,
    };
    const page = ref(options.page);
    const pageSize = ref(options.pageSize);
    const totalItems = ref(10);
    const search = ref(options.search);
    const hasMore = ref(true);
    const updateOptionsFromNewResponse = <RESPONSE extends IResponseShape>(
      response: RESPONSE | AnyObject,
    ) => {
      totalItems.value = response.totalCounts;
      hasMore.value = response.hasMore;
      page.value = response.page;
    };

    const info = computed(() => {
      return {
        total: totalItems.value,
        from: page.value * pageSize.value - pageSize.value + 1,
        to:
          page.value * pageSize.value > totalItems.value
            ? totalItems.value
            : page.value * pageSize.value,
      };
    });

    return {
      page,
      pageSize,
      totalItems,
      search,
      hasMore,
      updateOptionsFromNewResponse,
      info,
    };
  };
  const initialHeaders = <DATA>(headers: IEntryTableHeaders<ITEM>[]) => {
    return ref(headers) as Ref<IEntryTableHeaders<ITEM>[]>;
  };
  const makeFinallyHeaders = <DATA>(
    header1: IEntryTableHeaders<DATA>[],
    header2: IEntryTableHeadersSecond<DATA>[],
  ) => {
    // Step 1: Concatenate arrays, header1 first for priority
    const all = [...header1, ...header2];

    // Step 2: Group by 'key'
    const grouped = _.groupBy(all, "key");

    // Step 3: Merge objects, giving priority to header1
    const merged = _.map(grouped, (objs) => {
      // Find if header1 contains this key
      const h1 = header1.find((h) => h.key === objs[0]?.key);
      const h2 = header2.find((h) => h.key === objs[0]?.key);

      // Merge, header1 properties override header2
      return _.merge({}, h2, h1);
    });
    let output = merged.filter((item) => {
      return item.visible == undefined
        ? true
        : item.visible == false
          ? false
          : true;
    }) as unknown as IOutputTableHeader<DATA>[];
    return { merged, output };
  };
  const objectToHeaders = <DATA>(object: AnyObject) => {
    let headers: IOutputTableHeader<ITEM>[] = Object.entries(object).map(
      (item) => {
        let key = item[0];
        let value = item[1];
        return {
          key: key,
          title: value,
        };
      },
    );
    return headers as IOutputTableHeader<ITEM>[];
  };

  const items = ref<ITEM[]>([]);

  return {
    makeTableOptions,
    initialHeaders,
    makeFinallyHeaders,
    objectToHeaders,
    items,
  };
};
