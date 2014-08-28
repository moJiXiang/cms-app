
//simplely put all services here.


var app = angular.module('cmsAppApp');

// app.factory('authenticationInterceptor', function($q, $window, $location) {
//     return {
//       responseError : function(rejection) {
//         if (401 == rejection.status) {
//             // $location.path('/login');
//             $window.location.href = "login.html";
//             return;
//         }
//         return $q.rejection(rejection);
//       }
//     }
// });


app.factory('notifierService', [function () {

    var unread = [];
    
    return  {
        /**
         * notify, alert message that response user's event,maybe success or error
         * @param  {Object} msg response Object
         */
        notify : function (message) {
            unread.unshift(message);//push to the beginning of array
            console.log(unread);
        },

        dismiss : function (index) {
            unread.splice(index, 1);
        },

        dismissAll : function () {
            unread = [];
            return unread;
        },

        listUnread : function () {
            return unread;
        }
    }
}]);

app.factory('selectCityService', ['countryResource', 'cityResource', function (countryResource, cityResource) {
    var cities = [];
    return {
        getContinents : function () {
            return [
                    {name: "亚洲", value: "AS"},
                    {name: "欧洲", value: "EU"},
                    {name: "美洲", value: "NA"},
                    {name: "南美", value: "SA"},
                    {name: "非洲", value: "AF"},
                    {name: "大洋洲", value: "OC"}
                ]
        },
        getCountriesByContinent : function (continent, cb) {
            var continentcode = continent.value;
            countryResource.query({"getCountriesByContinent": continentcode}, function(items){
                cb(items);
            })
        },
        getCitiesByCountry : function (country, cb) {
            var countrycode = country.code;
            cityResource.query({'getCitiesByCountrycode': countrycode}, function (items) {
                cb(items);
            })
        }
    }
}]);

app.factory('seletTagService', ['labelResource', function (labelResource) {
    return {
        getMasterLabel : function (labelid) {
            return labelResource.get({
                id: labelid
            })
        },
        getItemSublabels : function (itemid, type) {
        	if(type == 'city') {
        		return labelResource.query({city: itemid, cmd: 'listByCity'});
        	}else {
        		return labelResource.query({attraction: itemid, cmd: 'listByAttraction'});
        	}
        },
        getMasterLabels : function () {
            /**
             * get masterlabels
             * @return {array}  data is result returned
             */
            return labelResource.query({
                criteria: {
                   level: '1'
                }
            })
        },

        getSubLabels : function () {
            /**
             * get sublabels
             * @return {array}  data is result returned
             */
            return labelResource.query({
                criteria: {
                    level: '2'
                }
            })
        }
    }
}])

app.factory('getUserService', ['userResource', function (userResource) {

    return {
        getUsers : function (opt, cb) {
            var editorsArr = [];
	        userResource.query({roles: opt.type}, function (items) {
                editorsArr = items.map(function (item) {
                    return {
                        editor_id : item._id,
                        editor_name : item.username
                    }
                })
                cb(editorsArr);
            });
        }
    }
}])

app.factory('AuditService', ['auditingResource', 'taskResource', 'notifierService', function (auditingResource, taskResource, notifierService) {
    return {
        getItemsAudit : function () {
            // add all citys's id in an array for http request
            // var itemids = citys.map(function(city) {
            //  return city._id
            // });

            // auditingResource.query({"items": itemids.join(',')}, function(audits) {
            //  console.log(audits);
            //  var cities = citys.forEach(function(city) {
            //      var id = city._id;
            //      audits.forEach(function(audit) {
            //          var item_id = audit.item_id;
            //          if(id == item_id) {
            //              if(audit.en) {
            //                  city.audit_en = audit;
            //              } else {
            //                  city.audit_zh = audit;
            //              }
            //          }
            //      })
            //  })
            // })
        },
        getAudit : function (opt, cb) {

            auditingResource.query({criteria:{item_id: opt.id, en: opt.en}}, function (items) {
                cb(items);
            });
        },
        getTaskEditor : function (opt, cb) {
            taskResource.query({criteria:{city_id: opt.id, type: opt.type, en: opt.en}}, function (items) {
                cb(items);
            });
        },
        postAudit : function (opt, cb) {
            console.log(opt);
            if(!opt.editor){
                notifierService.notify({
                    type: 'danger',
                    msg: '这个城市还没有被指派任务，请询问管理员！!'
                })
            } else if(!opt.auditor){
                notifierService.notify({
                    type: 'danger',
                    msg: '你必须指定一个审核员!'
                })
            } else {
                var audit         = opt.audit;
                audit.editorname  = opt.editor.editor_name;
                audit.editorid    = opt.editor.editor_id;
                audit.auditorname = opt.audit.auditor.editor_name;
                audit.auditorid   = opt.audit.auditor.editor_id;
                if(audit.editorname == audit.auditorname){
                    notifierService.notify({
                        type: 'danger',
                        msg: '不能给自己提交审核，请指定其他编辑!'
                    })
                } else {
                    audit.$save({cmd: 'submit'}, function (data) {
                        console.log(data);
                        notifierService.notify({
                            type: 'success',
                            msg: '已发送给'+ audit.auditorname + '!'
                        })
                    })
                }
            }
            cb(audit);
            
        },
        savecomment : function (field, content, auditmsg) {
            var commentitem = {
                field: field,
                comment: content
            }
            console.log(commentitem);
            var fieldarr = auditmsg.auditcomment.map(function (item) {
                return item.field;
            })
            var index = fieldarr.indexOf(field);
            console.log(index);
            if(index >= 0){

                auditmsg.auditcomment.splice(index, 1, commentitem);
            } else {
                auditmsg.auditcomment.push(commentitem);
            }
            notifierService.notify({
                type: 'success',
                msg: '保存批注成功！'
            })
        },
        passaudit : function (status, auditmsg) {
            console.log(auditmsg)
            if(auditmsg.auditorname){
                if(status == 2){
                    auditmsg.$save({cmd: 'approve'}, function(data) {
                        console.log(data);
                        notifierService.notify({
                            type: 'success',
                            msg: '此项已通过审核'
                        })
                    })
                } else {
                    auditmsg.$save({cmd: 'fail'}, function(data) {
                        console.log(data);
                        notifierService.notify({
                            type: 'warning',
                            msg: '此项未通过审核'
                        })
                    })
                }
            } else {
                 notifierService.notify({
                    type: 'danger',
                    msg: '此项未被编辑提交，不能进行审核！'
                })
            }
        }
    }
}])

app.factory('imgUrlService', [ function () {

    return {
        initImageUrl : function (data) {
            var imageurls = data.image_url.map(function (item) {
                return item.img
            })
            var imageUrlArr = data.image.map(function (item) {
                var idex = imageurls.indexOf(item);
                if(idex >= 0){
                    return {
                        "img" : item,
                        "url" : data.image_url[idex].url
                    }
                } else {
                    return {
                        "img" : item,
                        "url" : ''
                    }
                }
            })
           
            return imageUrlArr;
        },
        // addImgUrl : function (img, url, obj) {
        //     var item = {
        //         "img" : img,
        //         "url" : url
        //     };
        //     var imgs = obj.image_url.map(function (item) {
        //         return item.img;
        //     })
        //     var idx = imgs.indexOf(img);
        //     if(idx >= 0){
        //         obj.image_url.splice(idx, 1, item);
        //     } else {
        //         obj.image_url.push(item);
        //     }
        // },
        delImgUrl : function (img, obj) {
            console.log(img);
            var imgs = obj.image_url.map(function (item) {
                return item.img;
            })
            var idx = imgs.indexOf(img);
            obj.image_url.splice(idx, 1);
            console.log(obj.image_url)
            // cb();
            return obj.image_url;
        }
    }
}])