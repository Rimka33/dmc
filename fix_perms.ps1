$path = ".\dmc-key.pem"
$acl = Get-Acl $path
# Disable inheritance and remove all inherited rules
$acl.SetAccessRuleProtection($true, $false)
# Remove all existing explicit rules (clean slate)
foreach ($access in $acl.Access) {
    $acl.RemoveAccessRule($access) | Out-Null
}
# Create new rule for current user (Read only is sufficient and safer)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule($env:USERNAME, "Read", "Allow")
$acl.AddAccessRule($rule)
# Apply
Set-Acl $path $acl
Write-Host "Permissions fixed for $path"
