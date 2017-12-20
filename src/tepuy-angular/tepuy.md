##Main components

###Activity (tepuy-activity)
An activity enclosures a full set of answerable items. When required it can act as a data provider for the items inside. It also must define how the items inside must behave.

###Group (tepuy-group)

###Item (tepuy-item)

This encapsulates an answerable item. The user must provide an answer by any way provided, which it will be normally throw behaviors


##Behaviors

Modify the way a **tepuy-item** behaves when user acts over it. Behaviors can add/remove classes to the item they are attached to. A behavior must be always be attached to a **tepuy-item**. Behaviors are identified because the prefix **tepuy-act-as-**

###Common properties
	
  - **data-tepuy-off**: A css selector to indicate when the behavior must be turned off. Defaulted to *.tepuy-item-completed*

###selectable (tepuy-selectable)

Allows item to be selectable. A selectable item will have class 

######Css Classes
- .tepuy-selected: Item is selected


###greetable (tepuy-greetable)

Allows item to 'greet' its value after touched


###draggable (tepuy-draggable)

Allows item to be dragged and droped into a **drop zone**. A dragable item can be dragged to any capable drop-zone within the group the item belongs to or it can be dragged back to its initial container.

######Css Classes
- tepuy-dropped: **draggable** item has been dropped in a **drop-zone**

##Helper objects

###Drop zone (tepuy-drop-zone)

It represents a container for **draggable** items. Drop zones can have a limited capacity, so if a drop zone is fulfilled it will not accept and item to be dropped into.
	
  data-tepuy-correct-values: Separated comma list of valid values in the container
can also defin


######Css Classes
- tepuy-dropped: **draggable** item has been dropped in a **drop-zone**
