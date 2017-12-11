
function template_iteration(data) {
    let source = `
    <div class="iteration gallery" data-id="{{id}}">
      <div class="iteration_title">
       <div class="iteration_name">{{theme}}</div>
       <div class="iteration_date">{{date_begin}} - {{date_end}}</div>
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
                <div class="picture_username">
                    <a href="//sonic-world.ru/forum/user/{{user_sity_id}}-{{user_name}}">{{user_name}}</a>
                </div>
                </figcaption>
            </figure>
        {{/each}}
        
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

        work(data);
        new photoswipe_init('.gallery');

    }, function(e) {
        console.log('Error from load data.', e);
        document.getElementById("loader").innerHTML = 'Error from load data. :(';
    }
);


function work(data) {
    let template_iterations = document.getElementById("iterations");
    let iterations_data = alasql(`
        SELECT i.*
        FROM ? i
        ORDER BY i.date_begin DESC
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
            ORDER BY p.id
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
    
}


