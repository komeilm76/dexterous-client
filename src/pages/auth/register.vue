<template>
    <VCard>
        <VCardTitle>Register</VCardTitle>
        <VCardActions>
            <VBtn :to="'/auth/login'" variant="tonal">
                <span>Go To login Page</span>
                <VIcon>mdi-chevron-right</VIcon>
            </VBtn>
        </VCardActions>
    </VCard>
</template>
<script setup lang="ts"></script>
<style lang="sass" scoped></style>