$("#loginForm").validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 8
        },
        // user_type: {
        //     required: true,
        // }
    },
    submitHandler: function (form) {

        // var formData = new FormData($("#signupForm")[0]);

        $.ajax({
            type: "POST",
            url: "/loginUser",// where you wanna post
            data: $('#loginForm').serialize() ,
            processData: false,
            // contentType: false,
            success:function(data){
                if(data.status == 'success')
                {
                    toastr.success(data.message, 'Success')
                    const myTimeout = setTimeout(
                        window.location.href = '/'
                    , 5000);

                }
                else
                {
                    toastr.error(data.message, 'Error')
                }
                // Process with the response data
            },
            error: function(jqXHR, textStatus, errorMessage) {
                
                var errors = jqXHR.responseJSON.errors;

                if(jqXHR.status == 500)
                {
                    toastr.error(jqXHR.responseJSON.message, 'Error');
                }
                else
                {
                    errors.forEach(element => {
                 
                        toastr.error(element.msg, 'Error')
                       
                    });
                }
            },
        });
        
    }
});