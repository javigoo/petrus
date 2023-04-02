$treeOutput = 'Te voy a pasar mi directorio de trabajo actual y quiero que me digas de qué ficheros quieres ver el contenido para tratar de lograr mi objetivo o solucionar mi error. Devuelveme la lista de archivos que quieres ver con el formato $files = @("/relative_path/file1", "/relative_path/file2")'
$treeOutput += (Get-ChildItem -Recurse | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | Out-String)
$treeOutput += "Este es mi objetivo/error:`n"

Set-Content -Path "$PSScriptRoot\tree.txt" -Value $treeOutput -Force
