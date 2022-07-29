var newCodes = [], countryCode = [];

    function predicate() {
        var fields = [],
            n_fields = arguments.length,
            field, name, reverse, cmp;

        var default_cmp = function (a, b) {
                if (a === b) return 0;
                return a < b ? -1 : 1;
            },
            getCmpFunc = function (primer, reverse) {
                var dfc = default_cmp,
                // closer in scope
                    cmp = default_cmp;
                if (primer) {
                    cmp = function (a, b) {
                        return dfc(primer(a), primer(b));
                    };
                }
                if (reverse) {
                    return function (a, b) {
                        return -1 * cmp(a, b);
                    };
                }
                return cmp;
            };

        // preprocess sorting options
        for (var i = 0; i < n_fields; i++) {
            field = arguments[i];
            if (typeof field === 'string') {
                name = field;
                cmp = default_cmp;
            } else {
                name = field.name;
                cmp = getCmpFunc(field.primer, field.reverse);
            }
            fields.push({
                name: name,
                cmp: cmp
            });
        }

        // final comparison function
        return function (A, B) {
            var a, b, name, result;
            for (var i = 0; i < n_fields; i++) {
                result = 0;
                field = fields[i];
                name = field.name;

                result = field.cmp(A[name], B[name]);
                if (result !== 0) break;
            }
            return result;
        };
    }
   
$.ajax({
      url: "countryCode.json",
      dataType: "json",
      success: function(data) {
        for(var i in data){
          if(data[i].active == 1){
            newCodes.push(data[i]);
          }
        }
            // codes(newCodes);
            sortByDisplayFirst(newCodes);
            sortByDialCode(newCodes);
            return newCodes;
      }
});


function codes(){
      return newCodes;
}

function sortByDisplayFirst(){
  var codes = newCodes.sort(predicate({
            name:'displayFirst',
            reverse: false},'name'));
  populateSelect(codes)
  return codes;
}

function sortByDialCode(){
  var codes = newCodes.sort(function(a,b){return b.dialCode - a.dialCode});
  // console.log(codes);        
  return codes;
 
}

function populateSelect(j){
  var options = '';
      for (var i = 0; i < j.length; i++) {
        options += '<option value="' + j[i].dialCode + '">' + j[i].name + '</option>';
      }
      $("select#countryCodes").html(options);
      // console.log(options);
}
