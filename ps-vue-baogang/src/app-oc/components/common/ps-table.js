import TablePageSize from "./table-page-size";
import TablePagination from "./table-pagination";
export default {
  render(h) {
    let { $slots, pageInfo, headers } = this,
      { page, pageSize, checks } = pageInfo || {},
      children = $slots.default || [],
      { length } = children,
      currentChecks = new Array(length)
        .join(",")
        .split(",")
        .map((d, i) => {
          return i;
        })
        .slice(page * pageSize, (page + 1) * pageSize);
    headers = headers || [];
    const renderTableData = (child, index) => {
      child.children = [
        <td
          onClick={e => {
            if (checks[index] == null) {
              checks[index] = true;
            } else {
              delete checks[index];
            }
            checks = Object.assign({}, checks);
            this.checked({
              page,
              pageSize,
              checks
            });
          }}
        >
          <input
            type="checkbox"
            checked={checks[index] ? "checked" : ""}
            onMousedown={e => e.preventDefault()}
          />
        </td>
      ].concat(child.children);
      return child;
    };
    page = page - 0 || 0;
    pageSize = pageSize - 0 || 10;
    return (
      <div>
        <table
          class="table table-hover no-footer dataTable"
          style="width: 100%;"
        >
          <thead>
            <tr>
              <th
                style="width:20px;"
                onClick={e => {
                  let everyChecked = currentChecks.every(id => checks[id]);
                  currentChecks.forEach(id => {
                    if (everyChecked) {
                      delete checks[id];
                    } else {
                      checks[id] = true;
                    }
                    checks = Object.assign({}, checks);
                    this.checked({
                      page,
                      pageSize,
                      checks
                    });
                  });
                }}
              >
                <input
                  type="checkbox"
                  checked={currentChecks.some(id => checks[id])}
                  style="pointer-events:none;"
                />
              </th>
              {headers.map(d => {
                return <td domPropsInnerText={d}></td>;
              })}
            </tr>
          </thead>
          <tbody>
            {children && children.length > 0 ? (
              children
                .map(renderTableData)
                .slice(page * pageSize, (page + 1) * pageSize)
            ) : (
              <td colspan="10">没查询到数据</td>
            )}
          </tbody>
        </table>
        <div class="col-md-7">
          <table-page-size
            value={pageSize}
            onChange={value => {
              this.pageSizeChanged({
                page: 0,
                pageSize: value,
                checks
              });
            }}
          />
        </div>
        <div class="col-md-5">
          <table-pagination
            value={page}
            total={Math.ceil(length / pageSize)}
            onChange={value => {
              this.pageSizeChanged({
                page: value,
                pageSize,
                checks
              });
            }}
          />
        </div>
      </div>
    );
  },
  props: ["pageInfo", "headers"],
  model: {
    prop: "pageInfo",
    event: "pageSizeChange"
  },
  methods: {
    checked(value) {
      this.$emit("pageSizeChange", value);
    },
    pageChanged(value) {
      this.$emit("pageSizeChange", value);
    },
    pageSizeChanged(value) {
      this.$emit("pageSizeChange", value);
    }
  },
  components: {
    TablePageSize,
    TablePagination
  }
};
