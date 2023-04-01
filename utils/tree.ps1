Get-ChildItem -Recurse | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | Out-File -FilePath "$PSScriptRoot\resultado.txt"
