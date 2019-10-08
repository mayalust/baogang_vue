import mapper from "../../tools/mapper";
const { mapState, mapGetters, mapMutations, mapActions } = mapper;
export default {
  render(h) {
    let { buttons } = this;
    return (
      <div class="modal-footer padding-top-10">
        <div class="bootstrap-dialog-footer">
          <div class="bootstrap-dialog-footer-buttons">
            {buttons.map(({ label, click, cls }) => {
              return (
                <button class={`btn btn-${cls || "default"}`} onClick={click}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
  props: ["buttons"],
  computed: {}
};
