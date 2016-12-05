/**
 * Created by cFrost on 2016/12/4.
 */
$.fn.serializeJson=function(){
    var serializeObj={};
    var array=this.serializeArray();
    $(array).each(function(){
        if(serializeObj[this.name]){
            if($.isArray(serializeObj[this.name])){
                serializeObj[this.name].push(this.value);
            }else{
                serializeObj[this.name]=[serializeObj[this.name],this.value];
            }
        }else{
            serializeObj[this.name]=this.value;
        }
    });
    return serializeObj;
};

$.fn.eulertable = function (optionObj) {
    var table = this;
    var option = optionObj;
    var rows;
    var pages;
    var pageIndex;
    var pageSize;
    var total;
    var that;
    var query;
    return {
        init: function () {
            var htmlOption = getOption($(table).data('option'));
            option = $.extend({}, option, htmlOption);
            that = this;
            initEulerTable(table, option);
        },
        refreshData: function(queryObj) {
            if (typeof(queryObj) != 'undefined')
                query = queryObj;
            else
                queryObj = query;

            if(option.pagination == 'true') {
                if (typeof(queryObj) != 'object')
                    queryObj = {};

                queryObj.pageIndex = pageIndex;
                queryObj.pageSize = pageSize;

                if (typeof(queryObj.pageIndex) == 'undefined')
                    queryObj.pageIndex = 1;
                if (typeof(queryObj.pageSize) == 'undefined')
                    queryObj.pageSize = 10;
            }

            loadData(queryObj, function(data, textStatus) {
                rows = data.rows;

                wrapData(rows);

                if(option.pagination == 'true') {
                    pageIndex = data.pageIndex;
                    pageSize = data.pageSize;
                    total = data.total;
                    pages = parseInt(total / pageSize);
                    if(total % pageSize > 0) pages++;

                    var pageBtn = $(table).next('.euler-table-page-btn').children('ul');
                    wrapPageBtn(pageBtn, pageIndex, pages, that);
                }
            });
        },
        getData: function () {
            return rows;
        },
        getOption: function () {
            return option;
        },
        nextPage: function () {
            var queryObj = query;
            if (typeof(queryObj) != 'object')
                queryObj = {};
            queryObj.pageIndex = pageIndex + 1;
            queryObj.pageSize = pageSize;


            loadData(queryObj, function(data, textStatus) {
                rows = data.rows;

                wrapData(rows);

                if(option.pagination == 'true') {
                    pageIndex = data.pageIndex;
                    pageSize = data.pageSize;
                    total = data.total;
                    pages = parseInt(total / pageSize);
                    if(total % pageSize > 0) pages++;

                    var pageBtn = $(table).next('.euler-table-page-btn').children('ul');
                    wrapPageBtn(pageBtn, pageIndex, pages, that);
                }
            });

        },
        prePage: function () {
            var queryObj = query;
            if (typeof(queryObj) != 'object')
                queryObj = {};
            queryObj.pageIndex = pageIndex - 1;
            queryObj.pageSize = pageSize;


            loadData(queryObj, function(data, textStatus) {
                rows = data.rows;

                wrapData(rows);

                if(option.pagination == 'true') {
                    pageIndex = data.pageIndex;
                    pageSize = data.pageSize;
                    total = data.total;
                    pages = parseInt(total / pageSize);
                    if(total % pageSize > 0) pages++;

                    var pageBtn = $(table).next('.euler-table-page-btn').children('ul');
                    wrapPageBtn(pageBtn, pageIndex, pages, that);
                }
            });

        },
        goPage: function (pageNum) {
            var queryObj = query;
            if (typeof(queryObj) != 'object')
                queryObj = {};
            queryObj.pageIndex = pageNum;
            queryObj.pageSize = pageSize;


            loadData(queryObj, function(data, textStatus) {
                rows = data.rows;

                wrapData(rows);

                if(option.pagination == 'true') {
                    pageIndex = data.pageIndex;
                    pageSize = data.pageSize;
                    total = data.total;
                    pages = parseInt(total / pageSize);
                    if(total % pageSize > 0) pages++;

                    var pageBtn = $(table).next('.euler-table-page-btn').children('ul');
                    wrapPageBtn(pageBtn, pageIndex, pages, that);
                }
            });

        }
    }




    function initEulerTable(table, option) {

        var tbody = '<tbody></tbody>'
        $(table).append(tbody);

        var toolbar = option.toolbar;
        $(toolbar).insertBefore(table);

        if(option.pagination == 'true') {
            var pageBtnhtml = '<nav class="euler-table-page-btn">'
                + '<ul class="pagination">'
                + '</ul>'
                + '</nav>';
            $(pageBtnhtml).insertAfter(table);
        }
    }

    function loadData(queryData, callback) {
        var action = option.action;

        var data = {};
        if(typeof(queryData) != 'undefined') {
            data = queryData;
        }

        data._r = new Date().getTime();

        $.ajax({
            url: action,
            type:'GET',
            async:true,
            data: data,
            error:function(XMLHttpRequest, textStatus, errorThrown) {
            },
            success:function(data, textStatus) {
                callback(data, textStatus);
            }
        });
    }

    function getOption(str) {
        if(typeof(str) == 'undefined')
            return {};

        var untiArray = str.replace(/[\s]/g, '').split(',');

        var result = {};
        for(var i in untiArray) {
            var unti = untiArray[i];
            var key = unti.substr(0, unti.indexOf(':'));
            var value = unti.substr(unti.indexOf(':')+1);

            if((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"')))
                value = value.substr(1, value.length - 2)

            result[key] = value;
        }

        return result;
    }

    function wrapData(rows) {
        var ths = $(table).find('th');
        var html = "";

        for(var i in rows) {
            var row = rows[i];
            html += '<tr>';
            html += '<input type="hidden" value="'+i+'">';
            ths.each(function () {

                var field = $(this).data('field');
                var value;

                if(typeof(field) != 'undefined') {
                    value = row[field];
                } else {
                    value = '';
                }

                var formatter = $(this).data('formatter');
                if(typeof(formatter) != 'undefined') {
                    value = eval(formatter).call(formatter, value, row, i);
                }
                if(typeof(value) == 'undefined')
                    value = null;

                var optionTh = getOption($(this).data('option'));

                html += '<td>';

                if(optionTh.checkbox == 'true') {
                    var keyField = optionTh.checkboxKey;
                    var key;
                    if(typeof(keyField) != 'undefined') {
                        key = row[keyField];
                    }
                    if(typeof(key) == 'undefined')
                        key = '';

                    html += '<input type="checkbox" value="'+key+'"> ';
                }

                html += value + '</td>';

            });
            html += '</tr>'
        }
        $(table).find('tbody').html(html);
    }

    function wrapPageBtn(pageBtn, pageIndex, pages, that) {
        var html = '<li><a href="javascript:void(0)" onclick="prePage()">&laquo;</a></li>';

        if(pages <= 10) {
            for(var i = 1; i < pages+1; i++) {
                html += '<li class="page-'+i+'"><a href="javascript:void(0)" onclick="goPage('+i+')">'+i+'</a></li>';
            }
        } else {
            if(pageIndex <= 5) {
                for(var i = 1; i < 11; i++) {
                    html += '<li class="page-'+i+'"><a href="javascript:void(0)" onclick="goPage('+i+')">'+i+'</a></li>';
                }
            } else {
                html += '<li class="page-1"><a href="javascript:void(0)" onclick="goPage(1)">1</a></li>';
                html += '<li><span>...</span></li>';
                var start = pageIndex - 3;
                var end = pageIndex + 4;
                for(var i = start; i <= end; i++) {
                    html += '<li class="page-'+i+'"><a href="javascript:void(0)" onclick="goPage('+i+')">'+i+'</a></li>';
                }
            }
            html += '<li><span>...</span></li>';
            html += '<li class="page-'+pages+'"><a href="javascript:void(0)" onclick="goPage('+pages+')">'+pages+'</a></li>';
        }
        html += '<li><a href="javascript:void(0)" onclick="nextPage()">&raquo;</a></li>';

        pageBtn.html(html);

        $($(pageBtn).children('.page-'+pageIndex)).addClass('active');
    }
};



function activeFormatter(value,row,index){
    return value == true ? 'active': 'blocked';
}

function userActionBtnFormatter(value,row,index){
    var html = '<span style="float: right">';
    if(row.enabled == true)
        html +='<button type="button" class="btn btn-danger btn-user-action">Block</button>\n';
    else
        html +='<button type="button" class="btn btn-danger btn-user-action" disabled="disabled">Block</button>\n';
    html +='<button type="button" class="btn btn-default btn-user-action">Edit</button></span>'
    return html;
}
