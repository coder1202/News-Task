$("#newsForm").validate({
    rules: {
        title: {
            required: true,
        },
        description: {
            required: true,
        },
        startDate: {
            required: true,
        },
        endDate: {
            required: true,
        }
    },
    submitHandler: function (form) {

        form.submit();
        // var formData = new FormData($("#signupForm")[0]);

        // $.ajax({
        //     type: "POST",
        //     url: "/admin/addNewsPost",// where you wanna post
        //     data: $('#newsForm').serialize() ,
        //     // data: new FormData($('#newsForm')[0]),
        //     processData: false,
        //     // contentType: false,
        //     success:function(data){

        //         console.log("response : ",data);

        //         if(data.status == 'success')
        //         {
        //             toastr.success(data.message, 'Success')
        //             // const myTimeout = setTimeout(
        //             //     window.location.href = '/admin'
        //             // , 5000);

        //         }
        //         else
        //         {
        //             toastr.error(data.message, 'Error')
        //         }
        //         // Process with the response data
        //     },
        //     error: function(jqXHR, textStatus, errorMessage) {
                
        //         var errors = jqXHR.responseJSON.errors;

        //         console.log("errors : ",errors);

        //         if(jqXHR.status == 500)
        //         {
        //             toastr.error(jqXHR.responseJSON.message, 'Error');
        //         }
        //         else
        //         {
        //             errors.forEach(element => {
                 
        //                 toastr.error(element.msg, 'Error')
                       
        //             });
        //         }
        //     },
        // });
        
    }
});