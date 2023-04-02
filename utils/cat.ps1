Clear-Content "$PSScriptRoot\cat.txt"

$files = @(
    "/server/index.js",
    "/client/broadcast/script.js",
    "/client/monitor/script.js",
    "/server/views/broadcast.ejs",
    "/server/views/monitor.ejs",
    "/server/views/navbar.ejs"
)
# te paso el código de los archivos que me has pedido para que soluciones mi objetivo/error:
# te paso el código de parte los archivos que me has pedido para que soluciones mi objetivo/error, si están bien y no hay que modificarlos pídeme que continúe

$path = "C:\Users\Javi\Desktop\proyectos\petrus"
# Luego, para cada archivo en la lista, agregue su contenido al archivo cat.txt
$files | ForEach-Object {
    $filePath = Join-Path $path $_

    if (Test-Path $filePath) {
        # Agregue el nombre del archivo y su contenido al archivo cat.txt
        "${filePath}:`n" | Out-File -FilePath "$PSScriptRoot\cat.txt" -Append
        Get-Content $filePath | Out-File -FilePath "$PSScriptRoot\cat.txt" -Append
    }
}
