if (console.log === undefined) console.log = function() {};
console.log(
`%c                               
   Are you like web console?   
                               `,
'color:#FFFFFF;background-color:#993399;'
);

function template_iteration(data) {
    return `
        <div class="iteration" data-id="${data.id}">
          <div class="iteration_title">
           <div class="iteration_name">${data.theme}</div>
           <div class="iteration_date">${data.date_begin} - ${data.date_end}</div>
          </div>
          <div class="iteration_body"></div>
        </div>
    `;
}

function template_picture(data) {
    return `
        <div class="picture" data-id="${data.id}">
          <div class="picture_body">
              <img src="../data/upload/${data.file_path}/thumb_${data.file_name}" title="${data.title}">
          </div>
          <div class="picture_title">${data.title}</div>
          <div class="picture_username">${data.user_name}</div>
        </div>
    `;
}

// TODO: Create this with for.
jQuery.when(
    jQuery.getJSON('../data/json/picture.json'),
    jQuery.getJSON('../data/json/users.json'),
    jQuery.getJSON('../data/json/iteration.json'),
    jQuery.getJSON('../data/json/achivement.json'),
    jQuery.getJSON('../data/json/user_achivement.json'),
    jQuery.getJSON('../data/json/user_vote.json')
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
    console.log('>>>', e);
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
        let t_object = jQuery(template_iteration(row_i));
        let iteration_body = t_object.find('.iteration_body');
        
        let pistures_data = alasql(`
            SELECT p.*, u.name AS user_name, u.sity_id AS user_sity_id
            FROM ? p
            LEFT JOIN ? u ON u.id = p.user_id
            WHERE p.iteration_id = ?
            ORDER BY p.id
            `
            , [data.picture, data.users, row_i.id]
        );
        console.log(pistures_data);
        
        for (let row_p of pistures_data) {
            iteration_body.append(jQuery(template_picture(row_p)))
        }
        
        template_iterations.append(t_object);
    }
    
}


