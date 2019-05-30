

attachPath=$1
appPath=$2
output=$3

rm -Rf "$output" && cp -Rf "${appPath}" "${output}"

hdiutil detach "${attachPath}"

open ${output}
