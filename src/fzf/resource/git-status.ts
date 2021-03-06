import { isGitDirectory } from "@/connector/util"
import { createConvertDropPrefix } from "@/fzf/converter/drop-prefix-converter"
import { globalVariableSelector } from "@/module/selector/vim-variable"
import { execSyncCommand } from "@/system/command"
import type { FzfCommandDefinitionDefaultOption, Resource, SourceFuncArgs } from "@/type"

export const gitStatus = async (_args: SourceFuncArgs): Promise<Resource> => {
  if (!(await isGitDirectory())) {
    throw new Error("The current directory is not a git project")
  }

  const gitStatusCommand = globalVariableSelector("fzfPreviewGitStatusCommand")

  if (typeof gitStatusCommand !== "string") {
    return { lines: [] }
  }

  const { stdout, stderr, status } = execSyncCommand(gitStatusCommand)

  if (stderr !== "" || status !== 0) {
    throw new Error(`Failed to get the file list. command: "${gitStatusCommand}"`)
  }

  return { lines: stdout.split("\n").filter((line) => line !== "") }
}

export const dropGitStatusPrefix = createConvertDropPrefix(3)

export const gitStatusDefaultOptions = (): FzfCommandDefinitionDefaultOption => ({
  "--prompt": '"GitStatus> "',
  "--multi": true,
  "--preview": `'${globalVariableSelector("fzfPreviewGitStatusPreviewCommand") as string}'`,
})
