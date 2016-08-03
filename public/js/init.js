LarakitJs.initSelector('.js-fileupload', function () {
    var self = $(this),
        url = self.attr('data-url'),
        key = self.attr('data-key'),
        callback_done = self.attr('data-callback-done'),
        $progress = self.attr('data-progress'),
        mimes = self.attr('data-mimes'),
        mimes_error = self.attr('data-mimes-error');
    self.fileupload();
    self.fileupload('option', {
        maxFileSize: 999000,
        done: function (e, response) {
            if (callback_done) {
                callback_done = eval(callback_done);
                // $(response.result.row).appendTo($list);
                if ('function' == typeof (callback_done)) {
                    callback_done.call(self, response.result);
                }
            }
            LarakitJs.fire();
            larakit_toastr(response.result);
        },
        error: function (e, data) {
            toastr.error('Произошла ошибка при загрузке файла');
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $($progress + ' .progress-bar').css('width', progress + '%');
        },
        add: function (e, data) {
            // console.log(data);
            var uploadErrors = [];
            if (mimes != undefined) {
                var acceptFileTypes = new RegExp(mimes, "i");
                if (data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                    uploadErrors.push(mimes_error);
                }
            }
            if (data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > 5000000) {
                uploadErrors.push('Filesize is too big');
            }
            if (uploadErrors.length > 0) {
                alert(uploadErrors.join("\n"));
            } else {
                data.submit();
            }
        }
    })
        .prop('disabled', !$.support.fileInput)
        .parent()
        .addClass($.support.fileInput ? undefined : 'disabled');
});