if (console.log === undefined) console.log = function() {};
console.log(
`%c                               
   Are you like web console?   
                               `,
'color:#FFFFFF;background-color:#993399;'
);


function template_iteration(data) {
    let source = `
    <div class="iteration" data-id="{{id}}">
      <div class="iteration_title">
       <div class="iteration_name">{{theme}}</div>
       <div class="iteration_date">{{date_begin}} - {{date_end}}</div>
      </div>
      <div class="iteration_body">
      
        {{#each pictures}}
            <div class="picture" data-id="{{id}}">
              <div class="picture_body">
                  <img src="./data/upload/{{file_path}}/thumb_{{file_name}}" title="{{title}}">
              </div>
              <div class="picture_title">{{title}}</div>
              <div class="picture_username">
                <a href="//sonic-world.ru/forum/user/{{user_sity_id}}-{{user_name}}">{{user_name}}</a>
              </div>
            </div>
        {{/each}}
        
      </div>
    </div>
    `;
    let template = Handlebars.compile(source);
    return template(data);
}


// TODO: Create this with for.
jQuery.when(
    jQuery.getJSON('./data/json/picture.json'),
    jQuery.getJSON('./data/json/users.json'),
    jQuery.getJSON('./data/json/iteration.json'),
    jQuery.getJSON('./data/json/achivement.json'),
    jQuery.getJSON('./data/json/user_achivement.json'),
    jQuery.getJSON('./data/json/user_vote.json')
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
    }
).fail(function(e) {
    console.log('Error from load data.', e);
});


function work(data) {
//     let res = alasql(`
//         SELECT p.*, i.*, p.id AS picture_id, i.id AS iteration_id
//         FROM ? p
//         LEFT JOIN ? i ON p.iteration_id = i.id
//         ORDER BY i.date_begin DESC, p.id
//         `
//         , [data.picture, data.iteration]
//     );
//     console.log(res);

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
            SELECT p.*, u.name AS user_name, u.sity_id AS user_sity_id
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


