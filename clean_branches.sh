$branches_to_delete = git branch | Where-Object { $_ -notmatch "main" -and $_ -notmatch "\*" }

if ($branches_to_delete) {
    Write-Host "Branches à supprimer :" -ForegroundColor Red
    $branches_to_delete
    
    $confirmation = Read-Host "Confirmez la suppression (O/N)"
    if ($confirmation -eq 'O' -or $confirmation -eq 'o') {
        $branches_to_delete | ForEach-Object { git branch -D $_.Trim() }
        Write-Host "Branches supprimées avec succès!" -ForegroundColor Green
    }
} else {
    Write-Host "Aucune branche à supprimer." -ForegroundColor Green
}