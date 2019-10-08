import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  render(h) {
    let { formats, option } = this;
    const tools = {
        text({ value }) {
          return (
            <span style="padding-left:20px;color:#666;">{option[value]}</span>
          );
        },
        input({ value }) {
          return (
            <el-input
              value={option[value]}
              onInput={val => {
                option[value] = val;
              }}
            />
          );
        },
        inputDisabled({ value }) {
          return (
            <el-input
              value={option[value]}
              disabled={true}
              onInput={val => {
                option[value] = val;
              }}
            />
          );
        },
        select({ value, options = [] }) {
          return (
            <el-select
              filterable
              value={option[value]}
              onInput={val => {
                option[value] = val;
              }}
            >
              {options.map(({ name, path, fileNname }) => {
                return (
                  <el-option key={name} value={name} label={name}></el-option>
                );
              })}
            </el-select>
          );
        },
        switch({ value }) {
          return (
            <el-switch
              value={option[value] == 1}
              onInput={val => {
                option[value] = val ? 1 : 0;
              }}
            ></el-switch>
          );
        }
      },
      isNeeded = ({ need }) => {
        return need ? <span class="text-danger">*</span> : null;
      },
      getLabel = ({ label }) => {
        return <span>{label}</span>;
      },
      getContent = format => {
        let { type } = format,
          fn = tools[type];
        return fn.call(this, format);
      };
    return (
      <div class="modal-body padding-top-10 no-pad-bottom">
        <form role="form form-inline" class="form-horizontal">
          <div class="simple-form-field">
            {formats
              .filter(({ value }) => {
                return option[value] !== undefined;
              })
              .map(format => {
                return (
                  <div class="form-group margin-bottom-10">
                    <div
                      class="col-sm-4 dialog-control-label no-padding-right dialog-control-h"
                      style="height:auto;"
                    >
                      {isNeeded(format)}
                      {getLabel(format)}
                    </div>
                    <div
                      class="padding-left-5 dialog-control-h col-sm-7"
                      style="height:auto;"
                    >
                      {getContent(format)}
                    </div>
                  </div>
                );
              })}
          </div>
        </form>
      </div>
    );
  },
  props: ["option", "formats"]
};
