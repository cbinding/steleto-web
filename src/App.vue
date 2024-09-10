<script setup>
import DataConversion from '@/components/DataConversion.vue'
import TemplateList from '@/components/TemplateList.vue'
import TemplateItem from '@/components/TemplateItem.vue'
import CycleButton from '@/components/CycleButton.vue'
import NotificationList from '@/components/NotificationList.vue'
</script>

<template> 
    <!--testing the components UI-->
    <DataConversion/>  
    <br>
    <TemplateList/>
    <br>
    <TemplateItem/>
    <br>
    <!--shows bootstrap styles are working-->
    <h4>Boostrap styling... <span class="badge text-bg-primary">New</span></h4>
    <div class="d-grid gap-2 d-md-block">
        <CycleButton :list="['AD','BC','BP']" :index="1"/>
        <CycleButton :list="[{title: 'whoo', value:'percent'}, {value:'years'}]"/>     
    </div>   
    <NotificationList></NotificationList>
</template>

<style scoped>

</style>
