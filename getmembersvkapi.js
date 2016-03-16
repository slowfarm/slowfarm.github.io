VK.init({
    apiId: 5322127 
});

var membersGroups = []; 
getMembers(20629724);


function getMembers(group_id) {
	VK.Api.call('groups.getById', {group_id: group_id, fields: 'photo_50,members_count', v: '5.27'}, function(r) {
			if(r.response) {
				$('.group_info')
				.html('<img src="' + r.response[0].photo_50 + '"/><br/>' 
					+ r.response[0].name
					+ '<br/>Участников: ' + r.response[0].members_count);
				getMembers20k(group_id, r.response[0].members_count); 
			}
	});
}

// получаем участников группы, members_count - количество участников
function getMembers20k(group_id, members_count) {
	var code =  'var members;'
			+	'var offset = 100;'
			+	'while (offset < 2500 && (offset + ' + membersGroups.length + ') < ' + members_count + ')'
			+	'{'
				+	'members = members + API.wall.get({"owner_id": -' + group_id + ', "v": "5.27", "count": "100", "offset": (' + membersGroups.length + ' + offset)}).items;' 
				+	'offset = offset + 100;' 
			+	'}'
			+	'return members;'
	
	VK.Api.call("execute", {code: code}, function(data) {
		if (data.response) {
			for(var i=0; i< 2500; i++)
				membersGroups = membersGroups + data.response[i].text; // запишем это в массив
			$('.member_ids').append('Загрузка: ' + membersGroups + '/' + members_count);
			if (members_count >  membersGroups.length) 
				setTimeout(function() { getMembers20k(group_id, members_count); }, 333); // задержка 0.333 с. после чего запустим еще раз
			//else 
				//alert('Ура тест закончен! В массиве membersGroups теперь ' + membersGroups.length + ' элементов.');
		} else {
			alert(data.error.error_msg); 
		}
	});
}
