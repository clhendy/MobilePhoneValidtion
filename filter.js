$(document).ready(function() {
    $('#submitNumber').click(function() {
      validateNumber($('#countryCodes').val(),$('#msisdn').val());
    });
});

$(document).ready(function() {
    $('#msisdn').blur(function() {
      validateNumber($('#countryCodes').val(),$('#msisdn').val());
    });
});

function validateNumber (countryCode, msisdn){
        
        document.getElementById('errorMessageInvalidMsg').innerHTML = ''; 
        document.getElementById('errorMessageLengthMsg').innerHTML = '';
        document.getElementById('countryCode').innerHTML = '';
        document.getElementById('msisdnFormatted').innerHTML = '';
        
        var data, code = '',  msisdnFormatted = '', prefix = '', prefixVal = {},  formatSpace = {},errorMessageLength = false, errorMessageInvalid = false,regex, space,errorMessageLengthMsg = "number length wrong",
        errorMessageInvalidMsg = "not a mobile number";

            msisdn = msisdn.replace(/[^0-9]/g, "");
            if(msisdn.charAt(0) === '0'){
                msisdn = msisdn.slice(1);
            }
           data = new sortByDialCode();
            // console.log(data);
            // data.forEach(function(itm){
            for (var itm = 0; itm < data.length; itm ++){
                if(data[itm].prefixVal){
                    prefixVal = data[itm].prefixVal.split(',');
                }

                if(data[itm].msisdnFormat !== ''){
                    formatSpace = data[itm].msisdnFormat.split(',');
                }
                switch (data[itm].dialCode){
                    case countryCode:

                    if(data[itm].dialCode.length == 4 && data[itm].dialCode.substr(0,1) == '1'){
                        code = data[itm].dialCode.substr(0,1) + "("+ data[itm].dialCode.substring(1)+")";
                    } else {
                        code = data[itm].dialCode;
                    }

                    if(data[itm].validation == '1' && data[itm].dialCode == countryCode) {

                        if(msisdn.length == data[itm].msisdnCount) {
                            // msisdnFormatted = "(" + msisdn.substr(0, 3) + ") " + msisdn.substr(3, 3) + "-" + msisdn.substring(6);
                            if (data[itm].prefixNo !== null) {
                                prefix = msisdn.substr(0,data[itm].prefixNo);
                                if (prefixVal.indexOf(prefix) !== -1) {

                                   msisdnFormatted = formatNumber(data[itm].msisdnFormat,msisdn);

                                } else {
                                    msisdnFormatted = msisdn;
                                    errorMessageInvalid = true;
                                }

                            }
                        }

                        if(msisdn.length != data[itm].msisdnCount) {
                            msisdnFormatted = msisdn;
                            errorMessageLength = true;
                        }
                    } else {
                        if (countryCode == 1) {
                            msisdnFormatted = "(" + msisdn.substr(0, 3) + ") " + msisdn.substr(3, 3) + "-" + msisdn.substring(6);
                        } else {
                            msisdnFormatted = formatNumber(data[itm].msisdnFormat, msisdn);
                        }
                    }
                break;
                default:
                }
            }
        if(errorMessageInvalid === true){
        document.getElementById('errorMessageInvalidMsg').innerHTML = errorMessageInvalidMsg; 
        }
        if(errorMessageLength === true){
        document.getElementById('errorMessageLengthMsg').innerHTML = errorMessageLengthMsg;
        }
        
        if(errorMessageLength === false && errorMessageInvalid === false){
        document.getElementById('countryCode').innerHTML = '+ '+countryCode;
        document.getElementById('msisdnFormatted').innerHTML = msisdnFormatted;
        }
        // return {code: code, msisdnFormatted:msisdnFormatted,errorMessageInvalid:errorMessageInvalid,errorMessageLength:errorMessageLength};

}

function formatNumber(msisdnFormat, msisdn){
        var formatSpace = {}, regex, space, msisdnFormatted;
        msisdnFormatted = msisdn;
        if (msisdnFormat) {
            formatSpace = msisdnFormat.split(',');
            if (formatSpace.length > 0) {
                for (var i = 0; i < formatSpace.length; i++) {
                    var id = i + 1;
                    if (i === 0) {
                        regex = '(\\d{' + formatSpace[i] + '})';
                        space = '$' + id + ' ';
                    } else if (id != formatSpace.length) {
                        regex += '(\\d{' + formatSpace[i] + '})';
                        space += '$' + id + ' ';
                    } else {
                        regex += '(\\d{' + formatSpace[i] + '})';
                        space += '$' + id + '';
                    }

                }
                msisdnFormatted = msisdn.replace(new RegExp(regex), space);
            }

        }
        return msisdnFormatted;
    
}