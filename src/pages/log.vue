<template>
  <div class="w-full h-[100svh] [&>.article-part]:p-4! flex flex-col">
    <div class="article-part content grow flex items-center justify-center">
      <VFadeTransition>
        <router-view></router-view>
      </VFadeTransition>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
