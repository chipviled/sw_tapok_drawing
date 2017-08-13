
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
                    <img src="./data/upload/{{file_path}}/thumb_{{file_name}}" 
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
jQuery.when(
    jQuery.getJSON('./data/json/picture.json' + '?v=' + config.v),
    jQuery.getJSON('./data/json/users.json' + '?v=' + config.v),
    jQuery.getJSON('./data/json/iteration.json' + '?v=' + config.v),
    jQuery.getJSON('./data/json/achivement.json' + '?v=' + config.v),
    jQuery.getJSON('./data/json/user_achivement.json' + '?v=' + config.v),
    jQuery.getJSON('./data/json/user_vote.json' + '?v=' + config.v)
).done(
    function (
        picture,
        users,
        iteration,
        achivement,
        user_achivement,
        user_vote
    ) {
        let data = {
            picture: picture[0],
            users: users[0],
            iteration: iteration[0],
            achivement: achivement[0],
            user_achivement: user_achivement[0],
            user_vote: user_vote[0]
        };
        
        work(data);

//        jQuery('body').append(jQuery(template_photoswipe()));
        new photoswipe_init('.gallery');

    }
).fail(function(e) {
    console.log('Error from load data.', e);
});


function work(data) {

    let template_iterations = jQuery('.iterations');
    let iterations_data = alasql(`
        SELECT i.*
        FROM ? i
        ORDER BY i.date_begin DESC
        `
        , [data.iteration]
    );

    template_iterations.text('');
    
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
        
        let t_object = jQuery(template_iteration(row_i));
        
        template_iterations.append(t_object);
    }
    
}


