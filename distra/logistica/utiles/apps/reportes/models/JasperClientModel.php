<?php

/**
 * @class JasperclientModel
 * A simple application controller extension
 */
use Jaspersoft\Client\JasperClient;


class JasperClientModel
{
    private $client;

    public function __construct()
    {
        $this->client = new JasperClient();
        set_time_limit(0);
        ini_set('max_execution_time', 0);
    }

    /**
     * Obtiene el reporte del jasperserver.
     * @author Yadrian
     * * @param string $uri URI for the report you wish to run (is not null)
     * @param string $format The format you wish to receive the report in (default: pdf)
     * @param string $pages Request a specific page, or range of pages. Separate multiple pages or ranges by commas.
     *                          (e.g: "1,4-22,42,55-100")(default: null)
     * @param string $attachmentsPrefix a URI to prefix all image attachment sources with
     *                                  (must include trailing slash if needed)(default: null)
     * @param array $inputControls associative array of key => value for any input controls(default: null)
     * @param boolean $interactive Should reports using Highcharts be interactive?(default: false)
     * @param boolean $onePagePerSheet Produce paginated XLS or XLSX?(default: false)
     * @param boolean $freshData (default: false)
     * @param boolean $saveDataSnapshot (default: false)
     * @param string $transformerKey For use when running a report as a JasperPrint. Specifies print element transformers (default: null)
     * @return string Binary data of report los formatos de los reportes(HTML/PDF/DOCX/XLS/XLSX/ODT/ODS)
     */
    public function exportReport($datas)
    {
           if($this->client->getDatasource()){
               if ($datas) {
                   try {
                       $resource = $this->client->repositoryService()->getResource($datas['dirReport']);
                       if(strcmp($resource->getDatasource(), $this->client->getDatasource()) != 0 ){
                           $resource->setDataSource($this->client->getDatasource());
                           $updateDataSource = $this->client->repositoryService()->updateResource($resource,true);
                       } else {
                           $updateDataSource = true;
                       }
                       if($updateDataSource) {
                               $datas['params']['serverName'] = 'http://' . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'];
                               $datas['params']['serverName'] = 'https://gestion.ecmmariel.cu' ;
                               $datas['params']['idestructura'] = $this->global->Estructura->idestructura;
                               $report = $this->client->reportService()->runReport($datas['dirReport'],
                                   $datas['typeFormat'], $datas['pages'], $datas['attachmentsPrefix'], $datas['params'],
                                   $datas['interactive'], $datas['paginated']);
                               if (isset($datas['useFirma'])) {
                                   $result = new stdClass();
                                   $result->success = true;
                                   $result->data = $report;
                                   return $result;
                               } else {
                                   $this->autoShow = false;
                                   if ($datas['isAttachment']) {
                                       header('Cache-Control: must-revalidate');
                                       header('Pragma: public');
                                       header('Content-Description: File Transfer');
                                       header('Content-Disposition: attachment; filename='.ucfirst($datas['name']) . "." . strtolower($datas['typeFormat']));
                                       header('Content-Transfer-Encoding: binary');
                                       header('Content-Length: ' . strlen($report));
                                   }
                                   header ('Content-Type: ' . $datas['content'] .'; charset=utf-8');
                                   echo $report;
                               }
                       } else {
                           echo 'Mensaje: </br>';
                           echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                           echo '&nbsp;&nbsp;' . 'Error en la fuente de datos';
                           echo '</pre>' . '</br>';
                           echo 'Detalles:';
                           echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                           print_r('La fuente de dato no se actualiz&oacute;. Vuelve a intentarlo.');
                           echo '</pre>';
                       }
                   } catch (Exception $exc) {
                           $this->autoShow = false;
                       switch($exc->getCode()){
                           case 0:{
                               echo 'Mensaje: </br>';
                               echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                               echo '&nbsp;&nbsp;' . 'Error de conexi&oacute;n';
                               echo '</pre>' . '</br>';
                               echo 'Detalles:';
                               echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                               //print_r('El servidor no se encuentra disponible.</br> &nbsp;&nbsp; 1- El servidor puede estar apagado.</br> &nbsp;&nbsp; 2- El servidor no esta corriendo.</br> &nbsp;&nbsp; 3- El cliente debe estar configurado correctamente.</br> &nbsp;&nbsp; 4- Revisar elementos de seguridad(Firewall,Antivirus,IDS/IDP,Otros...).');
                               //echo '</pre>' . '</br>';
                              // echo 'Otros Detalles:';
                            //   echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                               print_r($exc);
                               echo '</pre>';
                               break;
                           };
                           case 200:{
                               break;
                           };
                           default: {
                           echo 'Mensaje: </br>';
                           echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                           echo '&nbsp;&nbsp;' . 'Error.Por favor contacte al administrador.';
                           echo '</pre>' . '</br>';
                           echo 'Detalles:';
                           echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                           echo $exc->getMessage();
                           echo '</pre>';
                           }
                           break;
                       };
                   }
               } else {
                   echo 'Mensaje: </br>';
                   echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                   echo '&nbsp;&nbsp;' . 'Parametros vacios';
                   echo '</pre>' . '</br>';
                   echo 'Detalles:';
                   echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                   print_r('Parametros vacios');
                   echo '</pre>';
               }
           } else {
               echo 'Mensaje: </br>';
               echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
               echo '&nbsp;&nbsp;' . 'Error en la configuraci&oacute;n';
               echo '</pre>' . '</br>';
               echo 'Detalles:';
               echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
               print_r('Por favor configure la fuente de dato en el archivo config.ini en la ruta /lib/JasperReports/JasperClient/class/Jaspersoft/Config/config.ini .');
               echo '</pre>';
           }
        }

    public function  runReport($datas)
    {
        if($this->client->getDatasource()){
            if ($datas) {
                try {
                    $resource = $this->client->repositoryService()->getResource($datas['dirReport']);
                    if(strcmp($resource->getDatasource(), $this->client->getDatasource()) != 0 ){
                        $resource->setDataSource($this->client->getDatasource());
                        $updateDataSource = $this->client->repositoryService()->updateResource($resource,true);
                    } else {
                        $updateDataSource = true;
                    }
                    if($updateDataSource) {
                        $datas['params']['serverName'] = 'http://' . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'];
                       // $datas['params']['idestructura'] = $this->global->Estructura->idestructura;
                        $report = $this->client->reportService()->runReport($datas['dirReport'],
                            $datas['typeFormat'], $datas['pages'], $datas['attachmentsPrefix'], $datas['params'],
                            $datas['interactive'], $datas['paginated']);
                        if (isset($datas['useFirma'])) {
                            $result = new stdClass();
                            $result->success = true;
                            $result->data = $report;
                            return $result;
                        } else {
                            $this->autoShow = false;
                            if ($datas['isAttachment']) {
                                header('Cache-Control: must-revalidate');
                                header('Pragma: public');
                                header('Content-Description: File Transfer');
                                header('Content-Disposition: attachment; filename='.ucfirst($datas['name']) . "." . strtolower($datas['typeFormat']));
                                header('Content-Transfer-Encoding: binary');
                                header('Content-Length: ' . strlen($report));
                            }
                            header ('Content-Type: ' . $datas['content'] .'; charset=utf-8');
                            echo $report;
                        }
                    } else {
                        echo 'Mensaje: </br>';
                        echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                        echo '&nbsp;&nbsp;' . 'Error en la fuente de datos';
                        echo '</pre>' . '</br>';
                        echo 'Detalles:';
                        echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                        print_r('La fuente de dato no se actualiz&oacute;. Vuelve a intentarlo.');
                        echo '</pre>';
                    }
                } catch (Exception $exc) {
                    $this->autoShow = false;
                    switch($exc->getCode()){
                        case 0:{
                            echo 'Mensaje: </br>';
                            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                            echo '&nbsp;&nbsp;' . 'Error de conexi&oacute;n';
                            echo '</pre>' . '</br>';
                            echo 'Detalles:';
                            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                            //print_r('El servidor no se encuentra disponible.</br> &nbsp;&nbsp; 1- El servidor puede estar apagado.</br> &nbsp;&nbsp; 2- El servidor no esta corriendo.</br> &nbsp;&nbsp; 3- El cliente debe estar configurado correctamente.</br> &nbsp;&nbsp; 4- Revisar elementos de seguridad(Firewall,Antivirus,IDS/IDP,Otros...).');
                            //echo '</pre>' . '</br>';
                            // echo 'Otros Detalles:';
                            //   echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                            print_r($exc);
                            echo '</pre>';
                            break;
                        };
                        case 200:{
                            break;
                        };
                        default: {
                        echo 'Mensaje: </br>';
                        echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                        echo '&nbsp;&nbsp;' . 'Error.Por favor contacte al administrador.';
                        echo '</pre>' . '</br>';
                        echo 'Detalles:';
                        echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                        echo $exc->getMessage();
                        echo '</pre>';
                        }
                        break;
                    };
                }
            } else {
                echo 'Mensaje: </br>';
                echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                echo '&nbsp;&nbsp;' . 'Parametros vacios';
                echo '</pre>' . '</br>';
                echo 'Detalles:';
                echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
                print_r('Parametros vacios');
                echo '</pre>';
            }
        } else {
            echo 'Mensaje: </br>';
            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
            echo '&nbsp;&nbsp;' . 'Error en la configuraci&oacute;n';
            echo '</pre>' . '</br>';
            echo 'Detalles:';
            echo '<pre style="background: #f8f8f8 none repeat scroll 0 0;border: 1px dotted #ccc;font-size: 12px;line-height: 14px;margin: 1em 0;padding: 7px;">';
            print_r('Por favor configure la fuente de dato en el archivo config.ini en la ruta /lib/JasperReports/JasperClient/class/Jaspersoft/Config/config.ini .');
            echo '</pre>';
        }
    }
}
