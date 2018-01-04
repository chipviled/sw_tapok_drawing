
function template_iteration(data) {
    let source = `
    <div class="iteration gallery" data-id="{{id}}">
      <div class="iteration_title">
           {{#if iteration_name}}
               <div class="iteration_name">{{iteration_name}}</div>
           {{/if}}
           {{#if user_name}}
               <div class="iteration_name">
                   <a href="//sonic-world.ru/forum/user/{{user_sity_id}}-{{user_name}}">{{user_name}}</a>
               </div>
           {{/if}}
           
           {{#if date_begin}}
             <div class="iteration_date">{{date_begin}} - {{date_end}}</div>
           {{/if}}
           {{#if count_pictures}}
             <div class="iteration_info">Рисунков: {{count_pictures}}</div>
           {{/if}}
      </div>
      <div class="iteration_body" itemscope itemtype="http://schema.org/ImageGallery">

        {{#each pictures}}
            <figure class="picture
                    {{#is_win_null}}picture_win{{/is_win_null}}
                    {{#if is_voted}}{{else}}picture__not-voted{{/if}}
                    "
                    itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
                <a href="./data/upload/{{file_path}}/{{file_name}}"
                        class="picture_body "
                        itemprop="contentUrl"
                        data-size="{{pict_width}}x{{pict_height}}">
                    <img class="b-lazy"
                        src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
                        data-src="./data/upload/{{file_path}}/thumb_{{file_name}}"
                        itemprop="thumbnail" alt="pict" />
                </a>

                <figcaption itemprop="caption description">
                <div class="picture_title">{{title}}</div>
                {{#if user_name}}
                    <div class="picture_username">
                        <a href="//sonic-world.ru/forum/user/{{user_sity_id}}-{{user_name}}">{{user_name}}</a>
                    </div>
                {{/if}}
                {{#if picture_iteration_name}}
                    <div class="picture_iteration_name">
                        ({{picture_iteration_name}})
                    </div>
                {{/if}}
                </figcaption>
            </figure>
        {{/each}}

      </div>
    </div>
    `;
    let template = Handlebars.compile(source);
    return template(data);
}


function template_table(data) {
    let source = `
    <div class="iteration iteration_table" data-id="{{id}}">
      <div class="iteration_title">
           {{#if title_name}}
               <div class="title__name">{{title_name}}</div>
           {{/if}}
      </div>
      <div class="iteration_table__body">
        <table>
            <thead>
                <tr>
                    <th style="text-align:center;">Имя пользователя</th>
                    <th style="text-align:center;">Кол. рисунков (общее)</th>
                    <th style="text-align:center;">Кол. побед</th>
                    <th style="text-align:center;">Ачивки</th>
                </tr>
            </thead>
            <tbody>
                {{#each rows}}
                    <tr>
                        <td style="text-align:center;">
                            <a class="iteration_table__link"
                                href="//sonic-world.ru/forum/user/{{user_sity_id}}-{{user_name}}">{{user_name}}</a>
                        </td>
                        <td style="text-align:center;">{{count_pictures}}</td>
                        <td style="text-align:center;">{{count_wins}}</td>
                        <td>
                            {{#each achivements}}
                                <img class="iteration_table__achivement" src="{{image}}" alt="{{title}}  -  {{description}}">
                            {{/each}}
                        </td>
                    </tr>
                {{/each}}
            </tbody>
        </table>
      </div>
    </div>
    `;
    let template = Handlebars.compile(source);
    return template(data);
}



// TODO: Create this with for.
Promise.all([
    Vue.http.get('./data/json/picture.json' + '?v=' + config.v),
    Vue.http.get('./data/json/users.json' + '?v=' + config.v),
    Vue.http.get('./data/json/iteration.json' + '?v=' + config.v),
    Vue.http.get('./data/json/achivement.json' + '?v=' + config.v),
    Vue.http.get('./data/json/user_achivement.json' + '?v=' + config.v),
    Vue.http.get('./data/json/user_vote.json' + '?v=' + config.v)
]).then(
    function (values) {
        let data = {
            picture: values[0].body,
            users: values[1].body,
            iteration: values[2].body,
            achivement: values[3].body,
            user_achivement: values[4].body,
            user_vote: values[5].body
        };
        window.swtd_data = data;

        top_menu();

        iteration_pictures_list(data);

    }, function(e) {
        console.log('Error from load data.', e);
        document.getElementById("loader").innerHTML = 'Error from load data. :(';
    }
);


/**
 * @param data
 * @param config
 * @returns
 */
function iteration_pictures_list(data, config = {}) {
    let iteration_data_by_user = (config.iteration_data_by_user === 'ASC')?'ASC':'DESC';
    let order_by_picture = (config.order_by_picture === 'DESC')?'DESC':'ASC';

    
    let template_iterations = document.getElementById("iterations");
    let iterations_data = alasql(`
        SELECT i.*,
            i.theme AS iteration_name
        FROM ? i
        ORDER BY i.date_begin ${iteration_data_by_user}
        `
        , [data.iteration]
    );

    template_iterations.innerHTML = '';

    for (let row_i of iterations_data) {
        let pistures_data = alasql(`
            SELECT p.*,
              u.name AS user_name,
              u.sity_id AS user_sity_id,
              IF(p.is_win > 0, true, NULL) AS is_win_null
            FROM ? p
            LEFT JOIN ? u ON u.id = p.user_id
            WHERE p.iteration_id = ?
            ORDER BY p.id ${order_by_picture}
            `
            , [data.picture, data.users, row_i.id]
        );

        row_i.pictures = pistures_data;

        let t_object = document.createElement('li');
        t_object.innerHTML = template_iteration(row_i);
        template_iterations.appendChild(t_object);
    }

    let bLazy = new Blazy({
        // options
    });
    new photoswipe_init('.gallery');
}

/**
 * @param data
 * @param config
 * @returns
 */
function user_pictures_list(data, config = {}) {
    let order_by_user = (config.order_by_user === 'ASC')?'ASC':'DESC';
    let order_by_picture = (config.order_by_picture === 'ASC')?'ASC':'DESC';
    
    let template_iterations = document.getElementById("iterations");
    let iterations_data = alasql(`
        SELECT u.*,
          COUNT(p.id) AS count_pictures,
          u.name AS user_name,
          u.sity_id AS user_sity_id
        FROM ? u
        LEFT JOIN ? p ON u.id = p.user_id
        GROUP BY u.id
        HAVING COUNT(p.id) > 0
        ORDER BY COUNT(p.id) ${order_by_user};
        `
        , [data.users, data.picture]
    );

    template_iterations.innerHTML = '';

    for (let row_i of iterations_data) {
        let pistures_data = alasql(`
            SELECT p.*,
              u.sity_id AS user_sity_id,
              IF(p.is_win > 0, true, NULL) AS is_win_null,
              i.theme AS picture_iteration_name
            FROM ? p
            LEFT JOIN ? u ON u.id = p.user_id
            LEFT JOIN ? i ON p.iteration_id = i.id
            WHERE u.id = ?
            ORDER BY p.id ${order_by_picture}
            `
            , [data.picture, data.users, data.iteration, row_i.id]
        );

        row_i.pictures = pistures_data;

        let t_object = document.createElement('li');
        t_object.innerHTML = template_iteration(row_i);
        template_iterations.appendChild(t_object);
    }

    let bLazy = new Blazy({
        // options
    });
    new photoswipe_init('.gallery');
}

/**
 * @param data
 * @param config
 * @returns
 */
function user_name_pictures_list(data, config = {}) {
    let order_by_user_name = (config.order_by_user_name === 'ASC')?'ASC':'DESC';
    let order_by_picture = (config.order_by_picture === 'ASC')?'ASC':'DESC';
        
    let template_iterations = document.getElementById("iterations");
    let iterations_data = alasql(`
        SELECT u.*,
          u.id AS id, 
          u.sity_id AS user_sity_id,
          u.name AS user_name,
          COUNT(p.id) AS count_pictures
        FROM ? u
        LEFT JOIN ? p ON u.id = p.user_id
        GROUP BY u.id
        HAVING COUNT(p.id) > 0
        ORDER BY u.user_name ${order_by_user_name}
        `
        , [data.users, data.picture]
    );
        
    template_iterations.innerHTML = '';

    for (let row_i of iterations_data) {
        let pistures_data = alasql(`
            SELECT p.*,
              u.sity_id AS user_sity_id,
              IF(p.is_win > 0, true, NULL) AS is_win_null,
              i.theme AS picture_iteration_name
            FROM ? p
            LEFT JOIN ? u ON u.id = p.user_id
            LEFT JOIN ? i ON p.iteration_id = i.id
            WHERE u.id = ?
            ORDER BY p.id ${order_by_picture}
            `
            , [data.picture, data.users, data.iteration, row_i.id]
        );

        row_i.pictures = pistures_data;

        let t_object = document.createElement('li');
        t_object.innerHTML = template_iteration(row_i);
        template_iterations.appendChild(t_object);
    }

    let bLazy = new Blazy({
        // options
    });
    new photoswipe_init('.gallery');
}


/**
 * @param data
 * @param config
 * @returns
 */
function table_user_achivement(data, config = {}) {
    let order_by_user_name = (config.order_by_user_name === 'ASC')?'ASC':'DESC';
        
    let template_iterations = document.getElementById("iterations");
    let table_data = alasql(`
        SELECT u.*,
          u.id AS id, 
          u.sity_id AS user_sity_id,
          u.name AS user_name,
          COUNT(p.id) AS count_pictures,
          SUM(IF(p.is_win > 0,1,0)) AS count_wins
        FROM ? u
        LEFT JOIN ? p ON u.id = p.user_id
        GROUP BY u.id
        HAVING COUNT(p.id) > 0
        ORDER BY user_name ${order_by_user_name}
        `
        , [data.users, data.picture]
    );
    
    template_iterations.innerHTML = '';
    
    let table = {};
    table.title_name = 'Выданные ачивки';
    table.rows = table_data;
    
    for (let i in table.rows) {
        let id_tmp = table.rows[i].id;
        
        let row_data = alasql(`
            SELECT a.*, 
                a.id AS achivement_id,
                a.title AS achivement_title,
                a.description AS achivement_description,
                u.id
            FROM ? a
            LEFT JOIN ? ua ON a.id = ua.achivement_id
            LEFT JOIN ? u ON ua.user_id = u.id
            WHERE u.id = ?
            GROUP BY a.id
            ORDER BY a.id ASC
            `
            , [data.achivement, data.user_achivement, data.users, id_tmp]
        );
        
        table.rows[i].achivements = row_data;
    }

    console.log(table);
    
    let t_object = document.createElement('li');
    t_object.innerHTML = template_table(table);
    template_iterations.appendChild(t_object);


//    let bLazy = new Blazy({
//        // options
//    });
//    new photoswipe_init('.gallery');
}



/**
 * Top menu initial.
 * @returns
 */
function top_menu() {
    let template = `
        <select class="top-menu__wiev-select" v-model="selected" v-on:change="selecting">
            <option v-for="option in options" v-bind:value="option.value">
                {{ option.text }}
            </option>
        </select>
    `;
    document.getElementById('top-menu').innerHTML = template;

    new Vue({
        el: '.top-menu__wiev-select',
        data: {
          selected: 'iteration_data_by_desc',
          options: [
            { text: 'Этапы (дата) ↑', value: 'iteration_data_by_asc' },
            { text: 'Этапы (дата) ↓', value: 'iteration_data_by_desc' },
            { text: 'Пользователи (кол.рисунков) ↑', value: 'users_pict_by_asc' },
            { text: 'Пользователи (кол.рисунков) ↓', value: 'users_pict_by_desc' },
            { text: 'Пользователи (имя) ↑', value: 'users_name_pict_by_asc' },
            { text: 'Пользователи (имя) ↓', value: 'users_name_pict_by_desc' },
            { text: 'Ачивки (таблица)', value: 'table_user_achivement_by_asc' },
          ]
        },
        methods: {
          selecting: function (event) {
              console.log('>>>', this.selected);
              switch (this.selected) {
                  case 'iteration_data_by_desc':
                      iteration_pictures_list(window.swtd_data, {iteration_data_by_user:'DESC'});
                      break;
                  case 'iteration_data_by_asc':
                      iteration_pictures_list(window.swtd_data, {iteration_data_by_user:'ASC'});
                      break;
                  case 'users_pict_by_asc':
                      user_pictures_list(window.swtd_data, {order_by_user:'ASC'});
                      break;
                  case 'users_pict_by_desc':
                      user_pictures_list(window.swtd_data, {order_by_user:'DESC'});
                      break;
                  case 'users_name_pict_by_asc':
                      user_name_pictures_list(window.swtd_data, {order_by_user_name:'ASC'});
                      break;
                  case 'users_name_pict_by_desc':
                      user_name_pictures_list(window.swtd_data, {order_by_user_name:'DESC'});
                      break;
                  case 'table_user_achivement_by_asc':
                      table_user_achivement(window.swtd_data, {order_by_user_name:'ASC'});
                      break;
              }
              return;
            }
        }
    })
}
