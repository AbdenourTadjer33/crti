# Documentation Permission Modules

### Traits
#### 1. HasPermission
#### 2. HasRole
#### 3. RefreshPermissionCache

## 1. HasPermission trait

This trait provides methods for handling permissions associated with a model.

- permissions: Defines a many-to-many relationship for permissions.
- loadPermissions: Loads permissions associated with the model and sets them to the permissions relationship.
- directPermissions: Retrieves direct permissions of the model.
- getAllPermissions: Retrieves all permissions associated with the model, including direct permissions and permissions inherited from roles.
- attachPermissions: Attaches specified permissions to the model.
- givePermissionsTo: Assigns specified permissions to the model.
- assignPermission: Assigns a single permission to the model.
- hasPermissions: Checks if the model has all of the provided permissions.
- hasDirectPermissions: Checks if the model has all of the provided direct permissions.
- hasAnyPermission: Checks if the model has any of the provided permissions.
- hasAnyDirectPermission: Checks if the model has any of the provided direct permissions.
- hasPermissionTo: Checks if the model has permission to a specific permission ID.
- hasDirectPermissionTo: Checks if the model has direct permission to a specific permission ID.
- revokePermissions: Revokes specified permissions from the model.
- revokePermission: Revokes a single permission from the model.

## Controller

### 1- RoleController
#### store method:
this method will create a new role if this does not exist.
this method accept as input:

- name 
- description [optional]
- permissions [optional]
- permissions_to_create [optional]

we can pass an array of permissions that exist on the database to attach with in this permissions

also we can pass an array of permissions that does not exist to create for this role
and after those permissions will be available to use.
