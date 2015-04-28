var XLIFF_TPL = {
    "header": '<xliff version = "1.2">\
                   \n<file original = "" source-language = "" target-language = "">\
                       \n<head> </head>\
                       \n<body>\n',

    "unit": '<trans-unit id="{{ uid }}">\
                 \n<source>{{ uvalue }}</source>\
             \n</trans-unit>\n',

    "footer": '\n</body>\n</file>\n</xliff>'
};

var convert2XLIFF = function(entry_json){
    /***
        Given a dictionary with keys = ids
        and values equals to strings generates
        and xliff file to send to unbabel.

        Example:
        {
            "123": "This is blue car",
            "234": "This house is yellow"
        }

        returns

        <xliff version="1.2">
            <file original = "" source-language="en" target-language="fr">
                <head></ head>
                <body>
                    <trans-unit id="14077">
                        <source>
                            T2 apartment, as new building with swimming pool, sauna and gym. Inserted in Quinta da Beloura 1, which offers a variety of services such as private security 24 hours, tennis, golf, hotel, restaurants, and more. The apartment has air conditioning in all rooms, central heating, balcony and security screen for children in all windows.
                        </ source>
                    </ trans-unit>
                </ body>
            </ file>
        </ xliff>
    ***/

    var entries = "";
    for(var key in entry_json){
        var value = entry_json[key];
        entries += createTransUnit(key, value).trim() + "\n";
    }
    return XLIFF_TPL.header + entries + XLIFF_TPL.footer;
};

var createTransUnit = function(uid, uvalue){
    return XLIFF_TPL.unit.replace("{{ uid }}", uid)
                         .replace("{{ uvalue }}", uvalue);
};

var convert2JSON = function(xliff_text, side){
    if(typeof(side) === "undefined"){
        side = "target";
    }

    var parser = new DOMParser(),
        doc = parser.parseFromString(xliff_text, "text/xml");

    var trans_units = doc.getElementsByTagName("trans-unit"),
        nr_tunits = trans_units.length;

    var result_dic = {};
    for(var t = 0; t < nr_tunits; t++){
        var trans_unit = trans_units[t],
            _id = trans_unit.getAttributeNode("id").value,
            source = trans_unit.getElementsByTagName("source")[0],
            target = trans_unit.getElementsByTagName("target");

        result_dic[_id] = result_dic[_id] = source.textContent.trim();
        if(side === "target" && target.length > 0){
            result_dic[_id] = target[0].textContent.trim();
        }
    }

    return result_dic;
};
