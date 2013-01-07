define(['views/EventListItemView' , 'vendors/Xenon/ListView'] , function (EventListItemView , ListView) {
  var EventListView = ListView.extend({
    className: 'event-list-view',
    listItemViewClass: EventListItemView
  });
  return EventListView;
});
