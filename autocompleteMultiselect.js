define(['jquery'], function ($) {
    //Catch all elements with class, and apply function to ip
    [].forEach.call(document.getElementsByClassName('autocomplete-input'), function (el) {
        console.log(el);
        let hiddenInput = document.createElement('input'),      //create the input to save the selected data
            mainInput = document.createElement('input'),      //create main input to select elements
            dataList = document.createElement('datalist'), //dropdown
            tags = [];                                   // array to save the selected elements

        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', el.getAttribute('data-name'));

        mainInput.setAttribute('type', 'text');
        mainInput.setAttribute('list', 'data-list-test');
        mainInput.classList.add('main-input');
        dataList.classList.add('element-list');
        dataList.id = 'data-list-test';

        //event listener to get elements and put in the array
        mainInput.addEventListener('input', function () {

            var val = mainInput.value;
            var found = false;
            //Verifica se o elemento que ele clicou já está adicionado na lista de tags
            tags.forEach(tag => {
                if (tag.text == val) {
                    found = true;
                    return;
                }
            });

            var opts = dataList.childNodes;
            //Se não encontrou o elemento na lista então adiciona uma tag
            if (!found) {
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].value === val) {
                        addTag(opts[i].value);
                        break;
                    }
                }
            } else {
                refreshTags();
            }

            $.ajax({
                url: 'http://localhost/joomla395/plugins/fabrik_element/databasejoin/search.php',
                data: { q: val },
                success: function (data) {
                    var opts = dataList.childNodes;
                    data.results.forEach(result => {
                        var bool = false;
                        for (var i = 0; i < opts.length; i++) {
                            if (result.text == opts[i].value || val == ' ' || val == '') {
                                bool = true;
                                return;
                            }
                        }
                        if (!bool) {
                            var option = document.createElement('option');
                            option.value = result.text;
                            dataList.appendChild(option);
                        }
                    });
                },
                dataType: "json"
            });
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

        function addTag(text) {

            let tag = {
                text: text,
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

        function removeTag(index) {
            let tag = tags[index];
            tags.splice(index, 1);
            el.removeChild(tag.container);
            refreshTags();
        }

        function refreshTags() {
            mainInput.value = '';
        }

        function filterTag(tag) {
            return tag.replace(/[^\w -]/g, '').trim().replace(/\W+/g, '-');
        }
    });
    var cssId = 'myCss';  // you could encode the css path itself to generate id..
    if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        fconsole(JSON.stringify(head));
        fconsole(link);
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://localhost/joomla395/plugins/fabrik_element/databasejoin/tags.css';
        link.media = 'all';
        head.appendChild(link);
    }
});