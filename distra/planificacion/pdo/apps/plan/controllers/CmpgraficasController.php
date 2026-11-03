<?php

/**
 * Controlador para el control de las graficas
 *
 * @author    Osleidy Quiala Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgraficasController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista graficas.phtml
     */
    function cmpgraficasAction()
    {
        $this->render();
    }

    public function cargarDisciplinaAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');

        $parametros->arrayautores = json_decode(
          stripslashes($this->_request->getPost('arrayautores'))
        );
        $parametros->arrayinvolucrados = json_decode(
          stripslashes($this->_request->getPost('arrayinvolucrados'))
        );

        $parametros->idusuario = $this->global->Perfil->idusuario;


        //---***filtro de involucrados***---//
        $arrayautoresact = array();
        $cero = 0;
        $uno = 1;
        if (isset($parametros->arrayinvolucrados[0])) {
          foreach ($parametros->arrayinvolucrados as $involucrado) {
            $id = $involucrado->idusuario;
            if ($involucrado->tipo == 0) {
              $id = $involucrado->idgrupo;
            }
            $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
            if ($involucrado->tipo == 1) {
              $arraygrupos
                = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                $id
              );
              if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                  $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                  $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                }
              }
            }
            if ($involucrado->tipo == 2) {
              $datosestructura
                  = $this->integrator->metadatos->DameEstructura(
                $involucrado->idinvolucrado
              );
              $id = $datosestructura[0]->idestructura;
              // $arrayinvolact[] = $id . $cero;
              $arrayinvolact[] = $id . $uno;
            }
          }
        }
        //---***filtro de autores***---//
        if (isset($parametros->arrayautores[0])) {
          foreach ($parametros->arrayautores as $autor) {
            $idautor = $autor->idautor;
            if ($autor->tipo == 0) {
              $arrayusuarios
                = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                $idautor
              );
              if (isset($arrayusuarios[0])) {
                foreach ($arrayusuarios as $usuario) {
                  $arrayautoresact[] = $idautor;
                }
              }
            } else {
              $arrayautoresact[] = $idautor;
            }
          }
        }
        //***---Filtro de autores e involucrados---***//
        if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
        ) {
          if ($parametros->enaprobacion == 0) {
            $arrayautoresact[] = $parametros->idusuario;
            $arrayinvolact[] = $parametros->idusuario . $cero;
            $arrayinvolact[] = $parametros->idusuario . $uno;
            $arraygrupos
                               = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $parametros->idusuario
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          } else {
            $arrayautoresact[] = $parametros->idusuario;
            $permisosubordinados
                               = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
              $parametros->idusuario
            );
            if (isset($permisosubordinados[0])) {
              foreach ($permisosubordinados as $subordinado) {
                $arrayautoresact[] = $subordinado['idpsobre'];
              }
            }
          }
        }
        $parametros->arrayautores = implode(',', $arrayautoresact);
        $parametros->arrayinvolucrados = implode(',', $arrayinvolact);

        $parametros->integrator = $this->integrator;
        $model = new CmpgestionaractividadesModel();
        if($parametros->idplan == '') {
            $result = $model->cargarDisciplina($parametros);
        } else {
            $result = $model->cargarDisciplinaPlan($parametros);
        }
        echo json_encode(array('data' => $result));
    }

    public function cargarBalanceAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

        $parametros->arrayautores = json_decode(
          stripslashes($this->_request->getPost('arrayautores'))
        );
        $parametros->arrayinvolucrados = json_decode(
          stripslashes($this->_request->getPost('arrayinvolucrados'))
        );

        //---***filtro de involucrados***---//
        $arrayautoresact = array();
        $cero = 0;
        $uno = 1;
        if (isset($parametros->arrayinvolucrados[0])) {
          foreach ($parametros->arrayinvolucrados as $involucrado) {
            $id = $involucrado->idusuario;
            if ($involucrado->tipo == 0) {
              $id = $involucrado->idgrupo;
            }
            $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
            if ($involucrado->tipo == 1) {
              $arraygrupos
                = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                $id
              );
              if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                  $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                  $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                }
              }
            }
            if ($involucrado->tipo == 2) {
              $datosestructura
                  = $this->integrator->metadatos->DameEstructura(
                $involucrado->idinvolucrado
              );
              $id = $datosestructura[0]->idestructura;
              // $arrayinvolact[] = $id . $cero;
              $arrayinvolact[] = $id . $uno;
            }
          }
        }
        //---***filtro de autores***---//
        if (isset($parametros->arrayautores[0])) {
          foreach ($parametros->arrayautores as $autor) {
            $idautor = $autor->idautor;
            if ($autor->tipo == 0) {
              $arrayusuarios
                = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                $idautor
              );
              if (isset($arrayusuarios[0])) {
                foreach ($arrayusuarios as $usuario) {
                  $arrayautoresact[] = $idautor;
                }
              }
            } else {
              $arrayautoresact[] = $idautor;
            }
          }
        }
        //***---Filtro de autores e involucrados---***//
        if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
        ) {
          if ($parametros->enaprobacion == 0) {
            $arrayautoresact[] = $parametros->idusuario;
            $arrayinvolact[] = $parametros->idusuario . $cero;
            $arrayinvolact[] = $parametros->idusuario . $uno;
            $arraygrupos
                               = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $parametros->idusuario
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          } else {
            $arrayautoresact[] = $parametros->idusuario;
            $permisosubordinados
                               = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
              $parametros->idusuario
            );
            if (isset($permisosubordinados[0])) {
              foreach ($permisosubordinados as $subordinado) {
                $arrayautoresact[] = $subordinado['idpsobre'];
              }
            }
          }
        }
        $parametros->arrayautores = implode(',', $arrayautoresact);
        $parametros->arrayinvolucrados = implode(',', $arrayinvolact);


        $model = new CmpgestionaractividadesModel();
        if($parametros->idplan == '') {
            $result = $model->cargarBalance($parametros);
        } else {
            $result = $model->cargarBalancePlan($parametros);
        }
        echo json_encode(array('data' => $result));
    }

    public function cargarTipoActAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);

        $model = new CmpgestionaractividadesModel();
        if($parametros->idplan == '') {
            $result = $model->cargarTipoAct($parametros);
        } else {
            $result = $model->cargarTipoActPlan($parametros);
        }
        echo json_encode(array('data' => $result));
    }

    public function cargarCriterioAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->eficiencia = $this->_request->getPost('eficiencia');
        $parametros->idobjetivo = $this->_request->getPost('idobjetivo');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);

        $model = new CmpgestionarobjetivosModel();
        $result = $model->cargarCriterioM($parametros);
        echo json_encode(
            array('data' => $result[0], 'categories' => $result[1])
        );
    }

    public function cargarTipoFipAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->cumplimiento = $this->_request->getPost('cumplimiento');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);


      $model = new CmpgestionarfipModel();
        $result = $model->cargarTipoFIP($parametros);
        echo json_encode(array('data' => $result));
    }

    public function cargarCumplFipAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->cumplimiento = $this->_request->getPost('cumplimiento');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);


      $model = new CmpgestionarfipModel();
        $result = $model->cargarCumplFip($parametros);
        echo json_encode(array('data' => $result));
    }

    public function cargarTiempoPlanAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->cumplimiento = $this->_request->getPost('cumplimiento');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

        $parametros->arrayautores = json_decode(
          stripslashes($this->_request->getPost('arrayautores'))
        );
        $parametros->arrayinvolucrados = json_decode(
          stripslashes($this->_request->getPost('arrayinvolucrados'))
        );

        //---***filtro de involucrados***---//
        $arrayautoresact = array();
        $cero = 0;
        $uno = 1;
        if (isset($parametros->arrayinvolucrados[0])) {
          foreach ($parametros->arrayinvolucrados as $involucrado) {
            $id = $involucrado->idusuario;
            if ($involucrado->tipo == 0) {
              $id = $involucrado->idgrupo;
            }
            $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
            if ($involucrado->tipo == 1) {
              $arraygrupos
                = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                $id
              );
              if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                  $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                  $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                }
              }
            }
            if ($involucrado->tipo == 2) {
              $datosestructura
                  = $this->integrator->metadatos->DameEstructura(
                $involucrado->idinvolucrado
              );
              $id = $datosestructura[0]->idestructura;
              // $arrayinvolact[] = $id . $cero;
              $arrayinvolact[] = $id . $uno;
            }
          }
        }
        //---***filtro de autores***---//
        if (isset($parametros->arrayautores[0])) {
          foreach ($parametros->arrayautores as $autor) {
            $idautor = $autor->idautor;
            if ($autor->tipo == 0) {
              $arrayusuarios
                = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                $idautor
              );
              if (isset($arrayusuarios[0])) {
                foreach ($arrayusuarios as $usuario) {
                  $arrayautoresact[] = $idautor;
                }
              }
            } else {
              $arrayautoresact[] = $idautor;
            }
          }
        }
        //***---Filtro de autores e involucrados---***//
        if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
        ) {
          if ($parametros->enaprobacion == 0) {
            $arrayautoresact[] = $parametros->idusuario;
            $arrayinvolact[] = $parametros->idusuario . $cero;
            $arrayinvolact[] = $parametros->idusuario . $uno;
            $arraygrupos
                               = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $parametros->idusuario
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          } else {
            $arrayautoresact[] = $parametros->idusuario;
            $permisosubordinados
                               = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
              $parametros->idusuario
            );
            if (isset($permisosubordinados[0])) {
              foreach ($permisosubordinados as $subordinado) {
                $arrayautoresact[] = $subordinado['idpsobre'];
              }
            }
          }
        }
        $parametros->arrayautores = implode(',', $arrayautoresact);
        $parametros->arrayinvolucrados = implode(',', $arrayinvolact);



      $model = new CmpgestionaractividadesModel();
        $result = $model->cargarTiempoPlanif($parametros);
        echo json_encode(array('data' => $result));
    }

    public function cargarEficienciaAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->cumplimiento = $this->_request->getPost('cumplimiento');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);


      $model = new CmpgestionarplanModel();
        $result = $model->cargarEficienciaPlan($parametros);
        echo json_encode(array('data' => $result));
    }

    /**
     * Accion para cargar las desviaciones-(modificaciones en las fechas)
     * por elementos (planes, acts y objs)
     */
    public function cargarDesviacionesAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->cant = $this->_request->getPost('cant');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);

        $model = new CmpgestionarplanModel();
        if($parametros->idplan == '') {
            $result = $model->cargarDesviaciones($parametros);
        } else {
            $result = $model->cargarDesviacionesPlan($parametros);
        }
        echo json_encode(array('data' => $result));
    }

    /**
     * Accion para cargar el comportamiento de las act relacionadas a los
     * planes con estado -Aprobado- *
     */
    public function cargarComportamientoAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->trimestre = $this->_request->getPost('trimestre');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;
        $model = new CmpgestionarplanModel();
        $result = $model->cargarComportamiento($parametros);
        echo json_encode(
            array('data' => $result[0], 'categories' => $result[1])
        );
    }

    /**
     * Accion para cargar la ejecucion de las act relacionadas a los
     * planes con estado -Aprobado-
     */
    public function cargarEjecucionAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->trimestre = $this->_request->getPost('trimestre');
        $parametros->ejecucion = $this->_request->getPost('ejecucion');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);


      $model = new CmpgestionarplanModel();
        $result = $model->cargarEjecucion($parametros);
        echo json_encode(array('data' => $result));
    }

    public function cargarCalidadAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);

      $model = new CmpgestionaractividadesModel();
        $result = $model->cargarCalidad($parametros);
        echo json_encode(array('data' => $result));
    }

    public function cargarCalidadTriAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;

      $parametros->arrayautores = json_decode(
        stripslashes($this->_request->getPost('arrayautores'))
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );

      //---***filtro de involucrados***---//
      $arrayautoresact = array();
      $cero = 0;
      $uno = 1;
      if (isset($parametros->arrayinvolucrados[0])) {
        foreach ($parametros->arrayinvolucrados as $involucrado) {
          $id = $involucrado->idusuario;
          if ($involucrado->tipo == 0) {
            $id = $involucrado->idgrupo;
          }
          $arrayinvolact[] = $id . $cero;
          $arrayinvolact[] = $id . $uno;
          if ($involucrado->tipo == 1) {
            $arraygrupos
              = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
              $id
            );
            if (isset($arraygrupos[0])) {
              foreach ($arraygrupos as $grupo) {
                $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                $arrayinvolact[] = $grupo['idgrupo'] . $uno;
              }
            }
          }
          if ($involucrado->tipo == 2) {
            $datosestructura
                = $this->integrator->metadatos->DameEstructura(
              $involucrado->idinvolucrado
            );
            $id = $datosestructura[0]->idestructura;
            // $arrayinvolact[] = $id . $cero;
            $arrayinvolact[] = $id . $uno;
          }
        }
      }
      //---***filtro de autores***---//
      if (isset($parametros->arrayautores[0])) {
        foreach ($parametros->arrayautores as $autor) {
          $idautor = $autor->idautor;
          if ($autor->tipo == 0) {
            $arrayusuarios
              = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
              $idautor
            );
            if (isset($arrayusuarios[0])) {
              foreach ($arrayusuarios as $usuario) {
                $arrayautoresact[] = $idautor;
              }
            }
          } else {
            $arrayautoresact[] = $idautor;
          }
        }
      }
      //***---Filtro de autores e involucrados---***//
      if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
      ) {
        if ($parametros->enaprobacion == 0) {
          $arrayautoresact[] = $parametros->idusuario;
          $arrayinvolact[] = $parametros->idusuario . $cero;
          $arrayinvolact[] = $parametros->idusuario . $uno;
          $arraygrupos
                             = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
          );
          if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
              $arrayinvolact[] = $grupo['idgrupo'] . $cero;
              $arrayinvolact[] = $grupo['idgrupo'] . $uno;
            }
          }
        } else {
          $arrayautoresact[] = $parametros->idusuario;
          $permisosubordinados
                             = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
            $parametros->idusuario
          );
          if (isset($permisosubordinados[0])) {
            foreach ($permisosubordinados as $subordinado) {
              $arrayautoresact[] = $subordinado['idpsobre'];
            }
          }
        }
      }
      $parametros->arrayautores = implode(',', $arrayautoresact);
      $parametros->arrayinvolucrados = implode(',', $arrayinvolact);


      $model = new CmpgestionaractividadesModel();
        $result = $model->cargarCalidadTri($parametros);
        echo json_encode(array('data' => $result));
    }



}
