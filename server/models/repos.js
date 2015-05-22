// module.exports = {
// }
// app.get('/api/repos', function (req, res) {
//   request({
//     url: 'https://api.github.com/user/repos?access_token='+ req.session.token+ '&type=all',
//     headers: {'User-Agent': req.user.username}
//   },
//   function(err,resp,body) {
//     var data = JSON.parse(body).map(function (repo) {
//       return {name: repo.full_name, id: repo.id};
//     })
//     res.status(200).json(data)
//   });
// });

// app.get('/api/orgs', function (req, res) {
//   request({
//     url: 'https://api.github.com/user/orgs?access_token='+ req.session.token+ '&type=all',
//     headers: {'User-Agent': req.user.username}
//   },
//   function (err, resp, body) {
//     var orgList = JSON.parse(body).map(function (org) {
//       return org.login;
//     })
//     res.status(200).json(orgList);
//   });

// });

// app.post ('/api/orgs/repos', function (req, res) {
//   var org = req.body.org;
//   request({
//     url: 'https://api.github.com/orgs/'+ org + '/repos?access_token='+ req.session.token,
//     headers: {'User-Agent': req.user.username}
//   },
//     function (err, resp, body) {
//       var data = [];
//         JSON.parse(body).forEach(function (repo) {
//         if (repo.permissions.push === true) {
//           data.push({name: repo.full_name, id: repo.id});
//         }
//       });
//       res.status(200).json(data)
//     });
// });


// app.post('/api/repos', function(req, res){

//   var path = req.body.path,
//       message = req.body.message,
//       sha=req.body.sha,
//       repo=req.body.repo,
//       content = btoa(req.body.content);
//   request ({
//     method: "PUT",
//     url: 'https://api.github.com/repos/' + repo+ '/contents/' + path +'?access_token='+ req.session.token,
//     headers: {'User-Agent': req.user.username},
//     json: {
//       message: message,
//       content: content,
//       sha: sha,
//       branch: "CODECOLAB"
//     }
//   },
//   function (err, resp, body) {
//     if (err) console.log(err)
//     else {
//       res.status(200).send(body.content.sha);
//     }
//   });
// })

// app.post ('/api/fileStruct/tree', function (req, res) {
//   var owner = req.body.repo[0],
//       repo = req.body.repo[1],
//       branch = req.body.branch;

//   request({
//     url: 'https://api.github.com/repos/' +owner+ '/' +repo+ '/git/refs/heads/' + branch+'?access_token='+ req.session.token,
//     headers: {'User-Agent': req.user.username}
//   },
//   function (err, resp, body) {
//     var data = JSON.parse(body);
//     var sha = data.object.sha;
//     var base = 'https://api.github.com/repos',
//         more = '/git/trees/',
//         last = '?recursive=1&access_token=',
//         concat = base + '/' +owner+ '/' + repo + more + sha + last + req.session.token

//     request({
//       url: concat,
//       headers: {'User-Agent': req.user.username}
//       },
//       function (err, resp, body){
//         var data = JSON.parse(body)
//         var salt = '$2a$10$JX4yfb1a6c0Ec6yYxkleie'
//         var newTree = data.tree.map(function(item) {
//           item.id = '0'+bcrypt.hashSync(repo+'/'+item.path+'Code-Colab-Extra-Salt',salt)
//           item.url = base+'/'+ owner + '/' + repo + '/contents/' + item.path
//           return item
//         })
//         res.status(200).send(newTree)
//       }
//     )   // this is a request inside of a request, so the ) may need to move
//   });
// });


// app.get('/api/branch/*', function(req, res) {
//   var repo = req.url.split('/').slice(3).join('/');
//   request({
//     url: 'https://api.github.com/repos/'+repo+'/branches?access_token=' + req.session.token,
//     headers: {'User-Agent': req.user.username}
//   },
//     function(err, resp, body) {
//       var exists= false,
//           branches = JSON.parse(body);

//       branches.forEach(function(branch) {
//         if (branch.name==="CODECOLAB") exists ='true';
//       })
//       res.send(exists);
//     })
// })

// app.post('/api/branch', function(req, res){
//   var owner=req.user.username,
//       repo = req.body.repo;

//   request({
//     url: 'https://api.github.com/repos/' + repo +'/git/refs/heads/master?access_token='+ req.session.token,
//     headers: {'User-Agent': owner}
//   },
//     function (err, resp, body) {
//       if (err) console.log(err);
//       var ref = JSON.parse(body).ref,
//           sha = JSON.parse(body).object.sha;
//       request.post({
//         url: 'https://api.github.com/repos/' + repo + '/git/refs?access_token='+ req.session.token,
//         headers: {'User-Agent': owner, 'Content-Type': 'application/json'},
//         json: {
//           ref: "refs/heads/CODECOLAB",
//           sha: sha
//         }
//       },
//         function(err, resp, body){
//           console.log('New Branch Created!')
//           res.send(body) //send back to client to use for commits
//         })
//       })
//     });

// app.post('/api/merge', function (req, res) {
//   var repo = req.body.repo,
//       title = req.body.title,
//       comments = req.body.comments,
//       user = req.user.username;
//   request.post ({
//     url: 'https://api.github.com/repos/' + repo + '/pulls?access_token='+ req.session.token,
//     headers : {
//       'User-Agent' : user
//     },
//     json: {
//       title: title,
//       head: "CODECOLAB",
//       base: "master",
//       body: comments
//     }
//   },
//   function (err, resp, body) {
//     if (err) { console.log('merge err', err) }
//     else {
//       if (body.errors) { res.status(200).send(body.errors[0].message) }
//       else {
//         var sha = body.head.sha,
//             num = body.number
//         request({
//         method: 'PUT',
//         url: 'https://api.github.com/repos/' + repo + '/pulls/' + num + '/merge?access_token='+ req.session.token,
//         headers : {
//           'User-Agent' : user
//         },
//         json: {
//           message: "Merged CodeColab Branch to master",
//           sha: sha
//         }
//       },
//         function (err, resp, body) {
//           request({
//             method: "GET",
//             url: "https://api.github.com/repos/" + repo + "/pulls/" + num + "/files?access_token=" + req.session.token,
//             headers: { 'User-Agent': user}
//           }, function (err, resp, body) {
//             res.sendStatus(200);
//           })
//         })
//       }
//     }
//   })
// })

