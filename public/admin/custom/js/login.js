$("#loginForm").validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    submitHandler: function (form) {

        // var formData = new FormData($("#signupForm")[0]);

        $.ajax({
            type: "POST",
            url: "/admin/loginAdmin",// where you wanna post
            data: $('#loginForm').serialize() ,
            processData: false,
            // contentType: false,
            success:function(data){

                console.log("response : ",data);

                if(data.status == 'success')
                {
                    toastr.success(data.message, 'Success')
                    const myTimeout = setTimeout(
                        window.location.href = '/admin'
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

                console.log("errors : ",errors);

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