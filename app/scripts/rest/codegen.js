
var fs = require('fs');


var template = fs.readFileSync('template.js', {encoding:'utf8'});


var names = [
{n: 'area', ns:'areas'}, 
{n: 'category', ns:'categories'}, 
{n: 'path', ns:'paths'}, 
{n: 'task', ns:'tasks'}, 
{n: 'attraction', ns:'attractions'}, 
{n: 'city', ns:'cities'}, 
{n: 'label', ns:'labels'}, 
{n: 'perm', ns:'perms'}, 
{n: 'taskquestion', ns:'taskquestions'}, 
{n: 'auditing', ns:'auditings'}, 
{n: 'edituser', ns:'editusers'}, 
{n: 'lifetag', ns:'lifetags'}, 
{n: 'restaurant', ns:'restaurants'}, 
{n: 'user', ns:'users'}, 
{n: 'bigtype', ns:'bigtypes'}, 
{n: 'entertainment', ns: 'entertainments'}, 
{n: 'meta', ns: 'metas'}, 
{n: 'shopping', ns:'shoppings'}
];


names.forEach(function(i) {
    fs.appendFileSync('entities.js', template.replace('users', i.ns).replace('models', i.ns).replace('userResource', i.n + 'Resource'));
});