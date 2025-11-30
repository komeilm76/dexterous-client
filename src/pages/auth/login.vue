<template>
    <VCard min-width="400" color="primary">
        <VCardTitle>Login</VCardTitle>
        <VDivider></VDivider>
        <VCardText>
            <VTextField label="Phone"></VTextField>
        </VCardText>
        <VDivider></VDivider>
        <VCardActions class="!p-4">
            <VBtn :to="'/auth/register'" block>
                <span>Go To Register Page</span>
                <VIcon>mdi-chevron-right</VIcon>
            </VBtn>
        </VCardActions>
    </VCard>
</template>
<script setup lang="ts"></script>
<style lang="sass" scoped></style>