<?php

class PedidosabcController extends ZendExt_Controller_Secure
{
   public $estados;
   public $pedidoAbcModel;

   public function init()
   {
      parent::init();
      $this->pedidoAbcModel = new DatpedidosabcModel();
   }

   public function pedidosabcAction()
   {
      $this->view->idioma = $this->global->Perfil->idioma;

      $this->render();
   }

   public function obtenerperiodosAction()
   {
      $obj = new Confperiodosclasificacionabc();
      $idestructura = $this->global->Estructura->idestructura;

      if ($this->global->Estructura->idorgano == -2) {
         $e = $this->integrator->metadatos->obtenerPadreEntidad($idestructura);
         if (count($e) > 0) {
            $idestructura = $e[0]->idestructura;
         } else {
            echo json_encode(['datos' => []]);
            return false;
         }
      }
      $m = $obj->obtenerTodosPeriodosClasificacionABC($idestructura);
      $dm = Doctrine_Manager::getInstance();
      $conn = $dm->getCurrentConnection();
      $sql = "SELECT idnaturaleza, denominacion FROM mod_datosmaestros.nom_naturaleza "
         . "order by denominacion";
      $rN = $conn->fetchAll($sql);
      $rNaturalezas = [];
      foreach ($rN as $n) {
         $rNaturalezas[$n['idnaturaleza']] = $n['denominacion'];
      }

      $r = [];
      foreach ($m as $v) {
         $arrNat = json_decode($v['naturalezas']);
         $naturalezas = [];
         foreach ($arrNat as $nn) {
            $naturalezas[] = $rNaturalezas[$nn];
         }
         $r[] = ['idconf' => $v['idconfperiodosclasificacionabc'],
            'periodo' => $v['fechainicio'] . " - " . $v['fechafin'],
            'naturalezas' => implode(',', $naturalezas)];
      }
      return $r;
   }

   public function obtenerPeriodoAnalizaryParametrosAction()
   {
      $m = [];
      $m['codigo'] = 1;
      $m['success'] = true;
      $texto = '';
      $tipo = 2;
      if ($this->global->Estructura->idorgano == -2) {
         $texto = 'UEB: ' . $this->global->Estructura->denominacion;
      } else {
         $tipo = 1;
      }

      if ($tipo == 2) {
         $m['estructura'] = $texto;
         $m['idestructura'] = $this->global->Estructura->idestructura;
         $m['tipo'] = $tipo;
         $m['periodos'] = $this->obtenerperiodosAction();

         $objParam = new ConfparametrosinventarioModel();
         $arrDep = $objParam->obtenerDepositosParametrizacion($m['idestructura']);
         foreach ($arrDep as &$dep) {
            $dep['deposito'] = $dep['codigo'] . " " . $dep['deposito'];
         }
         $m['depositos'] = $arrDep;

         $confPedido = $this->pedidoAbcModel->obtenerConfPedido();
         $m['idestructurarecibepedido'] = $confPedido[0]['idestructurarecibepedido'];
         $m['permitireditarpedido'] = $confPedido[0]['permitireditarpedido'];

      } else {
         $m['codigo'] = 2;
         $m['tipo'] = $tipo;
         $m['success'] = false;
         $m['mensaje'] = "La estructura del usuario no es una UEB.";
      }

      echo json_encode($m);
   }

   public function obtenerproductosperiodoconfAction()
   {
      echo json_encode(
         [
            'datos' => $this->pedidoAbcModel
               ->obtenerProductosPeriodoConf(
                  $this->_request->getPost('idconf')
                  , $this->_request->getPost('idueb')
                  , $this->_request->getPost('iddeposito')),
         ]
      );
   }

   public function obtenerpedidosabcAction()
   {
      echo json_encode(
         $this->pedidoAbcModel
            ->obtenerPedidosABC(
               $this->_request->getPost('limit')
               , $this->_request->getPost('start')
               , $this->global->Estructura->idestructura
               , $this->_request->getPost('idconf')
               , $this->_request->getPost('idlineaproducto')
               , $this->_request->getPost('criterio')
            )
      );
   }

   public function adicionarpedidoabcAction()
   {
      echo json_encode(
         $this->pedidoAbcModel
            ->adicionarPedidoABC(
               $this->_request->getPost('idestructura')
               , json_decode(stripslashes($this->_request->getPost('productos')))
               , $this->_request->getPost('idconf')
            )
      );
   }


   public function obtenerlineasproductoAction()
   {
      $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
      $sql = "SELECT idnaturaleza, denominacion FROM mod_datosmaestros.nom_naturaleza "
         . "order by denominacion";
      echo json_encode(['datos' => $conn->fetchAll($sql)]);
   }

   public function eliminarpedidosabcAction()
   {
      echo json_encode(
         $this->pedidoAbcModel
            ->eliminarPedidoAbc(
               $this->_request->getPost('idpedidoabc')
               , $this->_request->getPost('idpedido')
            )
      );
   }

   public function prepararpedidosabcAction()
   {
      echo json_encode(
         $this->pedidoAbcModel
            ->prepararPedidoAbc(
               $this->_request->getPost('idpedido')
            )
      );
   }

   public function obtenerproductosdelpedidoAction()
   {
      echo json_encode(
         [
            'datos' => $this->pedidoAbcModel
               ->obtenerProductosDelPedido(
                  $this->_request->getPost('idpedido')
               ),
         ]
      );

   }

   public function guardarcantidadesproductospedidoabcAction()
   {
      echo json_encode(
         $this->pedidoAbcModel
            ->guardarCantidadesProductosPedidoAbc(
               json_decode(stripslashes($this->_request->getPost('productos')))
            )
      );
   }

}
