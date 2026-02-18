<template>
  <VContainer>
    <VRow align="center" justify="center">
      <VCol cols="6">
        <div class="rounded-full p-12! text-center text-6xl border-4 border-tw-primary text-tw-primary">
          <span>Dexterous</span>
          <i class="fa-solid fa-medal"></i>
        </div>
      </VCol>
      <VCol cols="12">
        <VSelect label="font" :items="setting.statics.fontList" v-model="setting.defaults.font" item-value="key"
          item-title="name">
        </VSelect>
        <VSelect label="language" :items="setting.statics.languageList" v-model="setting.defaults.language"
          item-value="key" item-title="name"></VSelect>
        <VSelect label="theme" :items="setting.statics.themeModeList" v-model="setting.defaults.themeMode"
          item-value="key" item-title="name"></VSelect>
        <VSelect label="theme" :items="setting.statics.paletteList" v-model="setting.defaults.palette" item-value="key"
          item-title="name"></VSelect>
      </VCol>
      <VCard class="w-full">
        <VCardTitle>Card</VCardTitle>
        <VDivider></VDivider>
        <VCardText>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum placeat tempora at quia molestiae aspernatur
          distinctio!
        </VCardText>
        <VDivider></VDivider>
        <VCardActions>
          <VBtn color="primary">YES</VBtn>
          <VBtn color="secondary">NO</VBtn>
          <VBtn color="error">NO</VBtn>
          <VBtn color="info">NO</VBtn>
          <VBtn color="success">NO</VBtn>
          <VBtn color="warning">NO</VBtn>
        </VCardActions>
        <VBtn @click="showErrorToast()">error toast</VBtn>
        <div class="fixed bottom-0 right-0 p-[20px]!">
          <VExpandTransition group>
            <div v-for="item in toast.activeList.value" :key="item.id">
              <VCard density="compact" :color="item.type" variant="elevated" width="300" class="mb-2">
                <VCardTitle class="px-2 py-2 w-full">
                  <div class="flex w-full items-center justify-start">
                    <VBtn class="me-2" size="x-small" icon flat variant="tonal">
                      <VIcon>
                        <i class="fa fa-light fa-check"></i>
                      </VIcon>
                    </VBtn>
                    <span class="font-normal me-2 text-ellipsis shrink overflow-hidden">{{ item.title }}</span>
                    <VSpacer></VSpacer>
                    <div>
                      <VBtn class="me-2" size="x-small" icon flat variant="tonal" @click="item.saveToastInHistory()">
                        <VIcon>
                          <i class="fa fa-light fa-rectangle-history-circle-plus"></i>
                        </VIcon>
                      </VBtn>
                      <VBtn class="me-2" size="x-small" icon flat variant="tonal"
                        @click="item.isActive ? item.pause() : item.resume()">
                        <VIcon>
                          <i v-if="item.isActive" class="fa fa-light fa-pause"></i>
                          <i v-if="!item.isActive" class="fa fa-light fa-play"></i>
                        </VIcon>
                      </VBtn>
                      <VBtn size="x-small" icon flat variant="tonal" @click="item.stop()">
                        <VIcon>
                          <i class="fa fa-light fa-close"></i>
                        </VIcon>
                      </VBtn>
                    </div>
                  </div>
                </VCardTitle>
                <VProgressLinear class="mb-[1px]!" :buffer-value="100" :model-value="item.remainingPercent"
                  chunk-count="100" chunk-gap="0" height="2"></VProgressLinear>
                <template v-if="item.messages.length > 0">
                  <VCardText>
                    <div class="mb-1" v-for="message in item.messages" :key="message">{{ message }}</div>
                  </VCardText>
                </template>
                <VDivider></VDivider>
                <VCardActions>
                  <VBtn v-for="(action, index) in item.actions" @click="() => action.task()" :loading="action.loading">
                    {{
                      action.label }}
                  </VBtn>
                </VCardActions>
                <VCardText>{{ item.actions }}</VCardText>
                <!-- <VProgressLinear class="mb-[1px]!" :buffer-value="100" :model-value="item.remainingPercent"
                  chunk-count="100" chunk-gap="2" height="2"></VProgressLinear> -->
              </VCard>
            </div>
          </VExpandTransition>
        </div>
        <div>
          {{ useAppToast().getSavedToast() }}

        </div>
        <!-- <div>
          <div> finished: {{ toast.finishedList.value.length }}</div>
          <div v-for="item in toast.finishedList.value">{{ item }}</div>
        </div> -->
      </VCard>
    </VRow>
  </VContainer>


</template>

<script lang="ts" setup>
import { useApiSchemas } from '@/apis';
import { useApi } from '@/composables/api';
// import { useToast } from '@/composables/toast-new';
import { useAppSetting } from '@/stores/application/setting';
import kmIcon from 'km-icon';
import _ from 'lodash';
import { onMounted, ref, type Ref } from 'vue';
import { useToast } from '@/composables/toast-new';
import { VProgressLinear } from 'vuetify/components';
import tools from '@/tools';
import { useAppToast } from '@/stores/application/toast';

const setting = useAppSetting();

const apiSchema = useApiSchemas();
const api = useApi(apiSchema.getOrigin.config, (v) => {
  return {
    cacheTime: 0
  }
});


const toast = useToast()

onMounted(() => {
  // setInterval(() => {
  //   toast.show({ title: 'salam aleykom che khabar khubi ?', type: 'error' })
  // }, 4000);
})


// onMounted(() => {
//   api.method.send({
//     body: undefined,
//     cookies: {
//       sessionId: ''
//     },
//     headers: {
//       "x-api-key": ''
//     },
//     loadFromCache: false,
//     params: {
//       id: ''
//     },
//     query: {
//       searchTerm: 'dexterous',
//       page: 1,
//       pageSize: 10
//     },
//   })
// })

const loadingFeedback = ref<boolean>(false)

const showErrorToast = () => {
  toast.show({
    title: 'salam', type: 'error', actions: {
      log: {
        label: 'feedback',
        entryTask: (async ({ turnOffLoading, turnOnLoading }) => {
          turnOnLoading()
          await feedbackTask()
          turnOffLoading()
        })
      }
    }
  })
}

const feedbackTask = async () => {
  await tools.time.wait(2000);
}

</script>


<style lang="scss">
.box {
  width: 300px;
  height: 300px;
  background-color: white;
  overflow-y: auto;
  direction: ltr;

  .item {
    color: black;
  }
}

body[dir="rtl"] .box .item {
  direction: rtl;
}

body[dir="ltr"] .box .item {
  direction: ltr;
}
</style>
