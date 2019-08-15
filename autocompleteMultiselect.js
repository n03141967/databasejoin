define(['jquery'], function ($) {
    //Catch all elements with class, and apply function to ip
    [].forEach.call(document.getElementsByClassName('autocomplete-input'), function (el) {
        let hiddenInput = document.createElement('input'),      //create the input to save the selected data
            mainInput   = document.createElement('input'),      //create main input to select elements
            dataList    = document.createElement('datalist'),
            tags        = [];                                   // array to save the selected elements
        
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', el.getAttribute('data-name'));

        mainInput.setAttribute('type', 'text');
        mainInput.setAttribute('list', 'data-list-test');
        mainInput.classList.add('main-input');
        dataList.classList.add('element-list');
        dataList.id = 'data-list-test';

        //event listener to get elements and put in the array
        mainInput.addEventListener('input', function () {

            //add tag on click 
            var val  = mainInput.value;
            var opts = dataList.childNodes;
            for (var i = 0; i < opts.length; i++) {
                if(tags.indexOf(val) > -1) 
                    break;
                if (opts[i].value === val) {
                    // An item was selected from the list!
                    // yourCallbackHere()
                    alert(opts[i].value);
                    addTag(opts[i].value);
                    break;
                }
            }

            if(tags.indexOf(val) > -1) 
                return;

            $.ajax({
                url    : 'http://localhost/PITT/joomla/plugins/fabrik_element/databasejoin/search.php',
                data   : { q: val},
                success: function(data) {
                    for (var i = 0; i < opts.length; i++) {
                        if(data.results[0].text == opts[i].value || val == ' ' || val == '')
                            return;
                    }
                    // Create a new <option> element.
                    var option       = document.createElement('option');
                        option.value = data.results[0].text;
                    // attach the option to the datalist element
                    console.log(option);
                    dataList.appendChild(option);
                    // console.log(data.results.text);
                },
                dataType: "json"
            });
            // let enteredTags = mainInput.value.split(',');
            // if (enteredTags.length > 1) {
            //     enteredTags.forEach(function (t) {
            //         let filteredTag = filterTag(t);
            //         if (filteredTag.length > 0)
            //             addTag(filteredTag);
            //     });
            //     mainInput.value = '';
            // }
        });

        //if keydown is backspace remove tag
        mainInput.addEventListener('keydown', function (e) {
            // let keyCode = e.which || e.keyCode;
            // if (keyCode === 8 && mainInput.value.length === 0 && tags.length > 0) {
            //     removeTag(tags.length - 1);
            // }
        });

        el.appendChild(mainInput);
        el.appendChild(hiddenInput);
        el.appendChild(dataList);

        addTag('hello!');

        function addTag (text) {

            let tag = {
                text   : text,
                container: document.createElement('div'),
                content: document.createElement('span'),
                closeButton: document.createElement('span')
            };

            tag.container.classList.add('tag-container');
            tag.content.classList.add('tag-content');
            tag.closeButton.classList.add('tag-close-button');


            tag.content.textContent = tag.text;
            tag.closeButton.textContent = 'x';
            
            tag.closeButton.addEventListener('click', function () {
                removeTag(tags.indexOf(tag));
            });
            
            tag.container.appendChild(tag.content);
            tag.container.appendChild(tag.closeButton);
            
            tags.push(tag);

            el.insertBefore(tag.container, mainInput);

            refreshTags();
        }

        function removeTag (index) {
            let tag = tags[index];
            tags.splice(index, 1);
            el.removeChild(tag.container);
            refreshTags();
        }

        function refreshTags () {
            mainInput.value = '';
        }

        function filterTag (tag) {
            return tag.replace(/[^\w -]/g, '').trim().replace(/\W+/g, '-');
        }
    });
    var cssId = 'myCss';  // you could encode the css path itself to generate id..
    if (!document.getElementById(cssId))
    {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        fconsole(JSON.stringify(head));
        fconsole(link);
        link.id    = cssId;
        link.rel   = 'stylesheet';
        link.type  = 'text/css';
        link.href  = 'http://localhost/PITT/joomla/plugins/fabrik_element/databasejoin/tags.css';
        link.media = 'all';
        head.appendChild(link);
    }
});