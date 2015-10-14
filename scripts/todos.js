/**
 * Created by karthikb on 13/10/15.
 */

$(function(){

    var TodoItem = Backbone.Model.extend({
        description: "Empty todo...",
        status: "incomplete",
        toggleStatus: function () {
            if (this.get('status') == 'incomplete') {
                this.set({'status' : 'complete'});
            }
            else {
                this.set({'status' : 'incomplete'});
            }
        }
    });

    var TodoView = Backbone.View.extend({
        model: TodoItem,
        className: 'todo-item',
        initialize: function(){
            this.model.on('change',this.render,this);
            this.model.on('hide',this.remove,this);
        },
        template: _.template('<h3 class="<%= status %>" >'+
            '<input type=checkbox '+
                '<% if(status=="complete") print("checked") %>/>'+
                '<%= description %></h3>'),
        render: function(){
            this.$el.empty();
            this.$el.append(this.template(this.model.toJSON()));
            this.model.save();
            return this;
        },
        events: {
          'change input': 'toggleStatus'
        },
        toggleStatus: function(){
            this.model.toggleStatus();
        }
    });

    var TodoList = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("todos"),
        initialize: function(){
            this.on('remove', this.hideModel);
        },
        hideModel: function(todoItem){
            todoItem.trigger('hide');
        }
    });

    todoList = new TodoList();

    var TodoListView = Backbone.View.extend({
        id: 'todo-list',
        initialize: function(){
            this.collection.on('add',this.addOne,this);
            this.collection.on('reset',this.addAll,this);
            this.collection.fetch();
        },
        render: function(){
            this.addAll();
        },
        addOne: function(todoItem){
            var todoView = new TodoView({model: todoItem});
            this.$el.append(todoView.render().el)
        },
        addAll: function(){
            this.collection.forEach(this.addOne,this);
        }
    });

    var todoListView = new TodoListView({collection: todoList});

    $('#todoapp').append(todoListView.$el);

    $('#new-todo').on('keypress',function(e){
        var key = e.which;
        if(key == 13)  // the enter key code
        {
            var todoItem = new TodoItem({description: $('#new-todo').val(), status: "incomplete"});
            todoList.add(todoItem);
            $('#new-todo').val('');
            return false;
        }
    });
});