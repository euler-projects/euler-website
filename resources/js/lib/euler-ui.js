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

$(function(){
    var eulerTables = $('.euler-table-holder');
    eulerTables.each(function () {
        loadData(this);
    })
});

function loadData(table, queryData) {
    var option = getOption($(table).data('option'));

    var pageBtn = $(table).children('.euler-btn-group-page').children('ul');
    var currPage = $(pageBtn).children('.active').children('a').html();
    if(typeof(currPage) == 'undefined') {
        currPage = 1;
    }
    var action = option.action;

    var data = {};
    if(typeof(queryData) != 'undefined') {
        data = queryData;
    }
    data.pageIndex = currPage;
    data.pageSize = 10;
    data._r = new Date().getTime();

    $.ajax({
        url: action,
        type:'GET',
        async:true,
        data: data,
        error:function(XMLHttpRequest, textStatus, errorThrown) {
        },
        success:function(data, textStatus) {
            var ths = $(table).find('th');
            var html = "";
            for(var i in data.rows) {
                var row = data.rows[i];
                html += '<tr>';
                ths.each(function () {
                    if($(this).hasClass('euler-dashboard-user-ck-th')) {
                        var field = $(this).data('field')
                        var value = row[field];
                        if(typeof(value) == 'undefined')
                            value = '';
                        html += '<td><input type="checkbox" value="'+value+'"></td>';
                    } else if($(this).hasClass('euler-dashboard-user-action-th')) {
                        html += '<td class="euler-user-action-td">'
                            +'<button type="button" class="btn btn-danger btn-user-action">Block</button>\n'
                            +'<button type="button" class="btn btn-default btn-user-action">Edit</button>'
                            +'</td>';
                    } else {

                        var field = $(this).data('field');
                        if (typeof(field) == 'undefined') {
                            html += '<td></td>';
                        } else {
                            var value = row[field];
                            if(typeof(value) == 'undefined')
                                value = '-';
                            html += '<td>' + value + '</td>';
                        }
                    }

                })
                html += '</tr>'
            }
            $(table).find('tbody').html(html);

            var pageIndex = data.pageIndex;
            var pageSize = data.pageSize;
            var total = data.total;
            var pages = parseInt(total / pageSize);
            if(total % pageSize > 0) pages++;

            wrapPageBtn(pageBtn, pageIndex, pages);
        }
    });
}

function getOption(str) {
    var untiArray = str.split(',');

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

function wrapPageBtn(pageBtn, pageIndex, pages) {
    var html = '<li><a href="#">&laquo;</a></li>';

    if(pages <= 10) {
        for(var i = 1; i < pages+1; i++) {
            html += '<li class="page-'+i+'"><a href="javascript:void(0)" onclick="clickPage(this)">'+i+'</a></li>';
        }
    } else {
        if(pageIndex <= 5) {
            for(var i = 1; i < 11; i++) {
                html += '<li class="page-'+i+'"><a href="javascript:void(0)" onclick="clickPage(this)">'+i+'</a></li>';
            }
        } else {
            html += '<li class="page-1"><a href="javascript:void(0)" onclick="clickPage(this)">1</a></li>';
            html += '<li><span>...</span></li>';
            var start = pageIndex - 3;
            var end = pageIndex + 4;
            for(var i = start; i <= end; i++) {
                html += '<li class="page-'+i+'"><a href="javascript:void(0)" onclick="clickPage(this)">'+i+'</a></li>';
            }
        }
        html += '<li><span>...</span></li>';
        html += '<li class="page-'+pages+'"><a href="javascript:void(0)" onclick="clickPage(this)">'+pages+'</a></li>';
    }
    html += '<li><a href="#">&raquo;</a></li>';

    pageBtn.html(html);

    $($(pageBtn).children('.page-'+pageIndex)).addClass('active');
}

function clickPage(data) {
    $(data).parent().parent().children('.active').removeClass('active');
    $(data).parent().addClass('active');
    loadData($(data).parent().parent().parent().parent());
}
