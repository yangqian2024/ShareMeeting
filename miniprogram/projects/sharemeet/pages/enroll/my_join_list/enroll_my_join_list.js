const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const EnrollBiz = require('../../../biz/enroll_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLogin: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		ProjectBiz.initPage(this);

		this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	bindTap: function (e) {
		let id = pageHelper.dataset(e, 'id');

		let itemList = ['查看详情', '修改', '取消预定'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				let idx = res.tapIndex;
				if (idx == 0) {
					wx.navigateTo({
						url: '../my_join_detail/enroll_my_join_detail?id=' + id,
					});
				}
				if (idx == 1) {
					let enrollId = pageHelper.dataset(e, 'eid');
					wx.navigateTo({
						url: '../join_edit/enroll_join_edit?id=' + enrollId + '&enrollJoinId=' + id,
					});
				}

				if (idx == 2) {
					this.bindCancelTap(e);
				}

			},
			fail: function (res) { }
		})

	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	/** 搜索菜单设置 */
	_getSearchMenu: function () {
		let sortItem1 = [
			{ label: '排序', type: '', value: '' },
			{ label: '按时间倒序', type: 'timedesc', value: '' },
			{ label: '按时间正序', type: 'timeasc', value: '' }];

		let sortItems = [sortItem1];
		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '待审核', type: 'wait', value: '' },
			{ label: '预约成功', type: 'succ', value: '' },
			{ label: '审核未过', type: 'cancel', value: '' }
		]

		this.setData({
			search: '',
			sortItems,
			sortMenus,
			isLoad: true
		});

	},
	bindCancelTap: async function (e) {
		if (!await PassportBiz.loginMustCancelWin(this)) return;

		let enrollJoinId = pageHelper.dataset(e, 'id');

		let callback = () => {
			pageHelper.delListNode(enrollJoinId, this.data.dataList.list, '_id');
			this.data.dataList.total--;
			this.setData({
				dataList: this.data.dataList
			});
		}
		await EnrollBiz.cancelMyEnrollJoin(enrollJoinId, callback);
	}
})