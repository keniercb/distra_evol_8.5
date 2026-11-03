<?php











namespace Composer\Command;

use Composer\Composer;
use Composer\Factory;
use Composer\Util\RemoteFilesystem;
use Composer\Downloader\FilesystemException;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class SelfUpdateCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('self-update')
            ->setAliases(array('selfupdate'))
            ->setDescription('Updates composer.phar to the latest version.')
            ->setHelp(
                <<<EOT
                The <info>self-update</info> command checks getcomposer.org for newer
versions of composer and if found, installs the latest.

<info>php composer.phar self-update</info>

EOT
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $config = Factory::createConfig();
        $cacheDir = $config->get('cache-dir');

        $localFilename = realpath($_SERVER['argv'][0]) ?: $_SERVER['argv'][0];


        $tmpDir = is_writable(dirname($localFilename)) ? dirname($localFilename)
            : $cacheDir;
        $tempFilename
            = $tmpDir . '/' . basename($localFilename, '.phar') . '-temp.phar';


        if (!is_writable($tmpDir)) {
            throw new FilesystemException(
                'Composer update failed: the "' . $tmpDir
                . '" directory used to download the temp file could not be written'
            );
        }

        if (!is_writable($localFilename)) {
            throw new FilesystemException(
                'Composer update failed: the "' . $localFilename
                . '" file could not be written'
            );
        }

        $protocol = extension_loaded('openssl') ? 'https' : 'http';
        $rfs = new RemoteFilesystem($this->getIO());
        $latest = trim(
            $rfs->getContents(
                'getcomposer.org',
                $protocol . '://getcomposer.org/version',
                false
            )
        );

        if (Composer::VERSION !== $latest) {
            $output->writeln(
                sprintf("Updating to version <info>%s</info>.", $latest)
            );

            $remoteFilename = $protocol . '://getcomposer.org/composer.phar';

            $rfs->copy('getcomposer.org', $remoteFilename, $tempFilename);

            if (!file_exists($tempFilename)) {
                $output->writeln(
                    '<error>The download of the new composer version failed for an unexpected reason'
                );

                return 1;
            }

            try {
                @chmod($tempFilename, 0777 & ~umask());

                $phar = new \Phar($tempFilename);

                unset($phar);
                rename($tempFilename, $localFilename);
            } catch (\Exception $e) {
                @unlink($tempFilename);
                if (!$e instanceof \UnexpectedValueException
                    && !$e instanceof \PharException
                ) {
                    throw $e;
                }
                $output->writeln(
                    '<error>The download is corrupted (' . $e->getMessage()
                    . ').</error>'
                );
                $output->writeln(
                    '<error>Please re-run the self-update command to try again.</error>'
                );
            }
        } else {
            $output->writeln(
                "<info>You are using the latest composer version.</info>"
            );
        }
    }
}
