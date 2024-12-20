!macro customInstall
  WriteRegStr HKCR "ELECAI" "URL Protocol" ""
  WriteRegStr HKCR "ELECAI" "" "URL:ELECAI Protocol Handler"
  WriteRegStr HKCR "ELECAI\shell\open\command" "" '"$INSTDIR\eletron-chat-ai.exe" "%1"'
!macroend