<template>
    <div>
        <div v-if="TypeToString(property.type as Types) === 'String'">
            {{ property }}
        </div>

        <div v-else-if="TypeToString(property.type as Types) === 'Int'">
            <input 
                v-maska="'###'"                
                :name="property.name" 
                class="property-input"
            />
        </div>
    </div>
</template>

<style scoped>
.property-input {
    width: 100%;
    background-color: #515151;
    border-top: 1px solid #191919;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    align-items: center;
    padding: 2px 10px;
    color: #b4b4b4;
}
</style>

<script lang="ts">
import { Types } from '@/enums/types.enum';
import { IBlueprintProperties } from '@interfaces';
import { Component, Prop, Vue } from 'vue-facing-decorator';

@Component({
    provide: { Types }
})
export default class BlueprintProperty extends Vue {
    [x: string]: any;

    @Prop({ required: true })
    property!: IBlueprintProperties;

    TypeToString(type: Types) {
        switch(type){
            case Types.Any: return "Any";
            case Types.Float: return "Float";
            case Types.Int: return "Int";
            case Types.String: return "String";
            case Types.Array: return "Array";
            case Types.Object: return "Object";
            case Types.Function: return "Function";
            case Types.Options: return "Options";
            case Types.Boolean: return "Boolean";
        }
    }
}
</script>