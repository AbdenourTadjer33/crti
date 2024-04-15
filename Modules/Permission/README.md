# Documentation Permission Modules

### Traits
#### 1. HasPermission
#### 2. HasRole
#### 3. RefreshPermissionCache

## 1. HasPermission trait

This trait provides methods for handling permissions associated with a model.

- loadPermissions 
- attachPermissions
- givePermissionsTo
- assignPermission
- hasPermissions
- hasAnyPermission
- hasPermissionTo
- revokePermissions

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
