<?php

/**
 * Created by PhpStorm.
 * User: zaldivar
 * Date: 13/11/14
 * Time: 14:40
 */
class ZeolHelpService
{

    public function importProject($dirFileZip)
    {
        $dirPathApps = Zend_Registry::getInstance()->config->dir_webaplication;
        $dirRepositorio = $dirPathApps . 'zeolhelp/repositorio/';
        $dirWorkspace = $dirPathApps . 'zeolhelp/workspaces/';
        $targetPath = $dirRepositorio;
        // $targetPath = $targetPath . $_FILES['file']['name'];
        $name = basename($dirFileZip);
        $tmp = explode('.', $name);
        $length = count($tmp);
        /*Eliminar todo lo del repositorio*/
        shell_exec('rm -R ' . $dirRepositorio . '*');
        if ($tmp[$length - 1] == 'zip') {
            $dirorigen = str_replace(" ", "\\ ", $dirFileZip);
            $cmd = "cp " . $dirorigen . " " . $dirRepositorio;
            shell_exec($cmd);
            if (file_exists($targetPath)) {
                if (true) {
                    $manejador = new ManejadorEstructura();
                    $comman = 'cd ' . $dirRepositorio . '; unzip ' . $name . " -d " . $dirRepositorio;
                    shell_exec($comman);
                    $this->remove($name, $dirRepositorio);
                    $array = $this->getDirectory($dirRepositorio, 1);
                    $nameOne = $array[0];
                    if ($manejador->importSumVerify($dirRepositorio, $nameOne)) {
                        $dirHtml = $dirRepositorio . $nameOne . '/index.html';
                        $document = new DOMDocument();
                        $document->loadHTMLFile($dirHtml);
                        $ul = $document->getElementById('menu-indice');
                        if ($ul) {
                            $li = $ul->getElementsByTagName('li')
                                ->item(0);
                            if ($li) {
                                $a = $li->getElementsByTagName('a')
                                    ->item(0);
                                if ($a) {
                                    $uri = $a->getAttribute('uri');
                                    $nombre = ZendExt_IoC::getInstance()->seguridad->obtenerSubsistemaUri($uri);
                                    $nombre = ($uri == 'workspaces') ? $nameOne : str_replace(' ', '', $nombre);
                                    try {
                                        if ($manejador->validateHtmlMenu(
                                            $dirHtml,
                                            $nombre
                                        )
                                        ) {
                                            $dirCopy =
                                                ($uri == 'workspaces') ? $dirWorkspace : $dirPathApps . $uri . '/';
                                            if (is_dir($dirCopy)) {
                                                if (!is_dir(
                                                    $dirCopy . $nameOne
                                                )
                                                ) {
                                                    $this->copyPaste(
                                                        $nameOne,
                                                        $dirRepositorio,
                                                        $dirCopy
                                                    );
                                                    $this->remove(
                                                        $nameOne,
                                                        $dirRepositorio
                                                    );
                                                    $msg = 'El projecto ha sido
                                                  importado satisfactorimente.';
                                                    $result = array(
                                                        "succes" => true,
                                                        "codMsg" => 1,
                                                        "mensaje" => $msg
                                                    );
                                                } else {
                                                    $this->remove(
                                                        $nameOne,
                                                        $dirRepositorio
                                                    );
                                                    $msg = 'Ya existe un
                                                    proyecto con el
                                                    mismo nombre.';
                                                    $result = array(
                                                        "succes" => false,
                                                        "codMsg" => 6,
                                                        "mensaje" => $msg
                                                    );
                                                }
                                            } else {
                                                $this->remove(
                                                    $nameOne,
                                                    $dirRepositorio
                                                );
                                                $msgOne = "No existe un espacio
                                                de trabajo disponible.";
                                                $msgDos = "El subsistema '$uri'
                                                 no fue encontrado.";
                                                $mensaje = ($uri == "workspaces") ? $msgOne : $msgDos;
                                                $result = array(
                                                    "succes" => false,
                                                    "codMsg" => 6,
                                                    "mensaje" => $mensaje
                                                );
                                            }
                                        } else {
                                            $this->remove(
                                                $nameOne,
                                                $dirRepositorio
                                            );
                                            $msg = 'El fichero index.html esta
                                            corrupto.';
                                            $result = array(
                                                "succes" => false,
                                                "codMsg" => 6,
                                                "mensaje" => $msg
                                            );
                                        }
                                    } catch (Exception $ex) {
                                        $this->remove($nameOne, $dirRepositorio);
                                        $result = array(
                                            "succes" => false,
                                            "codMsg" => 6,
                                            "mensaje" => $ex->getMessage()
                                        );
                                    }
                                } else {
                                    $msg = 'El fichero index.html esta corrupto.';
                                    $result = array(
                                        "succes" => false,
                                        "codMsg" => 6,
                                        "mensaje" => $msg
                                    );
                                }
                            } else {
                                $this->remove($nameOne, $dirRepositorio);
                                $msg = 'El fichero index.html esta corrupto.';
                                $result = array(
                                    "succes" => false,
                                    "codMsg" => 6,
                                    "mensaje" => $msg
                                );
                            }
                        } else {
                            $this->remove($nameOne, $dirRepositorio);
                            $msg = 'El fichero index.html esta corrupto.';
                            $result = array(
                                "succes" => false,
                                "codMsg" => 6,
                                "mensaje" => $msg
                            );
                        }
                    } else {
                        $this->remove($nameOne, $dirRepositorio);
                        $msg = 'La estructura no es valida.';
                        $result = array(
                            "succes" => false,
                            "codMsg" => 6,
                            "mensaje" => $msg
                        );
                    }
                } else {
                    $this->remove($name, $dirRepositorio);
                    $msg = 'El formato introducido no es válido.';
                    $result = array(
                        "succes" => false,
                        "codMsg" => 6,
                        "mensaje" => $msg
                    );
                }
            } else {
                $msg = 'Error al copiar el fichero.';
                $result = array(
                    "succes" => false,
                    "codMsg" => 6,
                    "mensaje" => $msg
                );
            }
        } else {
            $msg = 'El fichero no es valido.';
            $result = array(
                "succes" => false,
                "codMsg" => 6,
                "mensaje" => $msg
            );
        }

        return $result;
    }

    private function remove($nameProject, $origen)
    {
        $nameProject = str_replace(" ", "\\ ", $nameProject);
        $cmd = 'rm -R ' . $origen . $nameProject;
        shell_exec($cmd);
    }

    private function getDirectory($dir, $pos)
    {
        $arraysDirectory = array_diff(
            scandir($dir),
            array('.', '..', '.svn', '.idea')
        );
        $arrays = array();
        $i = 0;
        foreach ($arraysDirectory as $value) {
            if ($i < $pos) {
                $arrays[$i++] = $value;
            }
        }

        return $arrays;
    }

    private function copyPaste($nameProject, $origen, $destino)
    {
        $nameProject = str_replace(" ", "\\ ", $nameProject);
        $cmd = 'cp -R ' . $origen . $nameProject . ' ' . $destino;
        $var = shell_exec($cmd);

        return $var;
    }
}