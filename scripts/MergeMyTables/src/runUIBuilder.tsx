import { bitable, IOpenSegmentType, FieldType } from "@lark-base-open/js-sdk";

const tables_meta = await bitable.base.getTableMetaList();
let options_list: any = [];
let source_checked_values_list: any = [];
tables_meta.forEach((item: any) => {
  if (item.name.includes('工作安排-')) {
    source_checked_values_list.push(item.id);
  }
  options_list.push({ label: item.name, value: item.id })
});



export default async function main(uiBuilder: any) {
  uiBuilder.form((form: any) => ({
    formItems: [
      form.select('table_Source_List', { label: '源数据表', options: options_list, multiple: true, defaultValue: source_checked_values_list }),
      // form.tableSelect('table_Target', { label: '目标数据表' }),
      // form.fieldSelect('field_Target', {
      //   label: '同步字段', sourceTable: 'table_Target', multiple: true, filter: ({ type }: { type: any }) => type === FieldType.Text || type === FieldType.Number || type === FieldType.SingleSelect || type === FieldType.MultiSelect || type === FieldType.DateTime || type === FieldType.Checkbox || type === FieldType.User || type === FieldType.Phone || type === FieldType.Url || type === FieldType.Attachment || type === FieldType.SingleLink || type === FieldType.DuplexLink || type === FieldType.Location || type === FieldType.Checkbox || type === FieldType.GroupChat,
      // }),

    ],
    buttons: ['合并数据'],

  }), async ({ values }: { values: any }) => {
    let { table_Source_List } = values;


    // console.log(values);

    // 判断以下字段是否进行了选择，如果未选择则提示并返回
    if (!table_Source_List) { alert("请选择源数据表"); return; }
    // if (!field_Target) { alert("选择同步字段"); return; }

    uiBuilder.showLoading('开始准备合并的数据...');

    // 获取数据表的名称
    const table_target = await bitable.base.getTableByName('总表');

    // 清空目标数据表
    const recordIdList = await table_target.getRecordIdList();
    if (recordIdList.length > 0) {
      await table_target.deleteRecords(recordIdList);
    }

    // 根据选择的字段信息生成包含字段id和name的数组
    let field_name_list: any = [];
    const metaList_target: any = await table_target.getFieldMetaList();
    metaList_target.forEach((target_item: any) => {
      // field_Target.forEach((field_item: any) => {
      //   if (target_item.id == field_item.id) {
      field_name_list.push({ field_id: target_item.id, name: target_item.name, type: target_item.type });
      // }
      // })
    })

    // console.log(field_name_list);

    // console.log(table_Source_List);
    let merge_field_name_list: any = [];

    // 循环处理多个源表的数据
    for (const table_Source of table_Source_List) {

      //根据前面的field_name_list重新生成包含name,type和源和目标数据表field_id的数组
      const table_source = await bitable.base.getTableById(table_Source as string);
      const table_source_name = await table_source.getName();

      merge_field_name_list = [];
      const metaList_source: any = await table_source.getFieldMetaList();
      // console.log(metaList_source);
      metaList_source.forEach((source_item: any) => {
        field_name_list.forEach((target_item: any) => {
          if (source_item.name === target_item.name) {
            merge_field_name_list.push({ name: target_item.name, type: target_item.type, field_id: { source_id: source_item.id, target_id: target_item.field_id } })
          }
        })
      })
      // console.log(1, merge_field_name_list);

      const recordid_list_source: any = await table_source.getRecordIdList();
      let records_update_list = [];
      let count = 0;
      // console.log(2, recordid_list_source);

      // 循环源表的数据记录
      const recordid_list_sourcre_len = recordid_list_source.length;
      const merge_field_name_list_len = merge_field_name_list.length;
      const fieldType_List = [1, 2, 3, 4, 5, 7, 11, 13, 15, 17, 18, 21, 22, 23];
      for (var i = 0; i < recordid_list_sourcre_len; i++) {

        let record_items: any = { fields: {} };
        try {
          record_items = await table_source.getRecordById(recordid_list_source[i]);
        } catch (e) {
          for (let index = 0; index < merge_field_name_list.length; index++) {
            if (fieldType_List.indexOf(merge_field_name_list[index].type) >= 0) {
              // console.log(index, merge_field_name_list[index]);
              let curr_cellvalue: any = "";
              try {
                curr_cellvalue = await table_source.getCellValue(merge_field_name_list[index].field_id.source_id, recordid_list_source[i]);
              } catch (e) {
                // curr_cellvalue = await table_source.getCellString(merge_field_name_list[index].field_id.source_id, recordid_list_source[i]);
                curr_cellvalue = null;
              }
              // console.log(index, curr_cellvalue);
              record_items.fields[merge_field_name_list[index].field_id.source_id] = curr_cellvalue;
              // console.log(index, record_items);
            }
          }
        }
        // console.log(i, record_items);

        // 循环处理字段数组
        let record_update_list: any = {};
        let fields_update_list: any = { 'fields': {} };

        for (var j = 0; j < merge_field_name_list_len; j++) {

          let record_value: any = '';
          const record_item: any = record_items.fields[merge_field_name_list[j].field_id.source_id];
          const merge_field_target_id = merge_field_name_list[j].field_id.target_id;
          // console.log(record_item);

          switch (merge_field_name_list[j].type) {
            case 1: //Text
              record_value = record_item ? record_item[0].text : '';
              record_value = [{ type: IOpenSegmentType.Text, text: record_value }]
              break;
            case 3: //SingleSelect
              record_value = record_item?.text || '';
              // 获取目标表单选字段的选项信息
              const target_ss_record_item = await table_target.getFieldMetaById(merge_field_target_id);
              let get_ss_options = target_ss_record_item?.property?.options || '';
              for (var k = 0; k < get_ss_options.length; k++) {
                if (record_value == get_ss_options[k].name) {
                  record_value = get_ss_options[k];
                  break;
                }
              }
              break;
            case 4: //MultiSelect
              record_value = record_item || '';
              // 获取目标表多选字段的选项信息
              const target_ms_record_item = await table_target.getFieldMetaById(merge_field_target_id);
              let get_ms_options = target_ms_record_item?.property?.options || '';
              let get_ms_options_value: any = [];
              for (var l = 0; l < record_value.length; l++) {
                for (var k = 0; k < get_ms_options.length; k++) {
                  if (record_value[l].text == get_ms_options[k].name) {
                    get_ms_options_value.push(get_ms_options[k]);
                  }
                }
              }
              record_value = get_ms_options_value;
              break;
            case 7: //Checkbox
              record_value = record_item ? true : false;
              break;
            case 2: //Number
            case 5: //DateTime
            case 11: //User
            case 13: //Phone
            case 15: //Url
            case 17: //Attachment
            case 18: //SingleLink
            case 21: //DuplexLink
            case 22: //Location
            case 23: //GroupChat
              record_value = record_item;
              break;
            default:
              record_value = null;
              break;
          }
          record_update_list[merge_field_target_id] = record_value;

        }
        count++;
        uiBuilder.showLoading(`正在处理【` + table_source_name + `】表的第` + String(i + 1) + `/` + recordid_list_sourcre_len + `条记录`);
        fields_update_list.fields = record_update_list;
        records_update_list.push({ "fields": record_update_list });

        // 达到500条记录或循环结束时写入数据表
        if (count === 500 || i === recordid_list_sourcre_len - 1) {
          uiBuilder.showLoading(`正在将【` + table_source_name + `】表的数据写入目标表，请稍等...`);
          await table_target.addRecords(records_update_list);
          count = 0;
          records_update_list = [];
        }
      }

    }

    // 隐藏加载提示
    uiBuilder.hideLoading();
    uiBuilder.message.success("数据全部合并完成");
  });
}