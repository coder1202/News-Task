$("#signupForm").validate({
    rules: {
        username: {
            required: true,
            minlength: 3
        },
        email: {
            required: true,
            email: true
        },
        mobile_no: {
            required: true,
            number: true,
        },
        password: {
            required: true,
            minlength: 8
        },
        confirm_password: {
            required: true,
            equalTo: "#password"
        },
        user_type: {
            required: true,
        },
    },
    submitHandler: function (form) {

        // var formData = new FormData($("#signupForm")[0]);

        $.ajax({
            type: "POST",
            url: "/addUser",// where you wanna post
            data: $('#signupForm').serialize() ,
            processData: false,
            // contentType: false,
            success:function(data){
                if(data.status == 'success')
                {
                    toastr.success(data.message, 'Success')
                    setTimeout(
                        window.location.href = '/login'
                    , 5000);
                }
                else
                {
                    toastr.error(data.message, 'Error')
                }
                // Process with the response data
            },
            error: function(jqXHR, textStatus, errorMessage) {
                console.log(jqXHR);

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