function HorizontalScrollableTable ($module) {
  this.$module = $module
}

HorizontalScrollableTable.prototype.init = function () {
  this.data_table = this.$module.querySelector('table')

  // might be worth adding the shadows separately
  this.left_shadow = this.$module.querySelector('.dl-data-table-left-shadow')
  this.right_shadow = this.$module.querySelector('.dl-data-table-right-shadow')

  this.table_viewer = this.$module.querySelector('.wide-table')
  this.table_viewer.addEventListener('scroll', this.toggleShadows.bind(this))

  // trigger toggleShadow for set up
  this.toggleShadows()
}

HorizontalScrollableTable.prototype.toggleShadows = function () {
  function scrolledRight (containedEl, viewerEl) {
    return (
      containedEl.offsetWidth - (viewerEl.scrollLeft + viewerEl.offsetWidth)
    )
  }

  this.left_shadow.classList.toggle(
    'visible',
    scrolledRight(this.data_table, this.table_viewer) <
      this.data_table.offsetWidth - this.table_viewer.offsetWidth
  )

  this.right_shadow.classList.toggle(
    'visible',
    this.table_viewer.scrollLeft <
      this.data_table.offsetWidth - this.table_viewer.offsetWidth
  )

  setTimeout(
    function () {
      this.left_shadow.classList.add('with-transition')
      this.right_shadow.classList.add('with-transition')
    }.bind(this),
    2000
  )
}

export default HorizontalScrollableTable
