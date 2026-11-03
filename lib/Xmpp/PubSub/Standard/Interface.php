<?php

/**
 * Xmpp_PubSub_Standard_Interface
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Pubsub_Standard
 * @version 1.0
 */

interface Xmpp_Pubsub_Standard_Interface
{
  public function init($config = array());

  public static function getInstance();

  public function getNodeSubscriptions();

  public function getNodeAffiliations();

  public function subscribe($node, $subJid=false, $options = false);

  public function unsubscribe($node, $subJid=false, $subId=false);

  public function getSubscriptionOption($node, $subJid=false, $subId = false);

  public function getDefaultSubscriptionOption($node);

  public function setSubscriptionOption($node, $options, $subJid=false, $subId = false);

  public function getNodeItems($node);

  public function getNodeItemsByItemID($node, $itemID);

  public function publishItem($node, $item, $itemId=false, $options=false);

  public function deleteItem($node, $itemId);

  public function createNode($node, $configure = false, $type = false);

  public function configureNode($node, $configure);

  public function getNodeConfig($node);

  public function getDefaultNodeConfig();

  public function deleteNode($node, $redirectURI=false);

  public function purgeNode($node);

  public function getSubscriberList($node);

  public function updateSubscription($node, $jid, $subscription, $subid = false);

  public function getAffiliationList($node);

  public function updateAffiliation($node, $jid, $affiliation);

  public function discoFeatures();

  public function discoNodes($node = false);

  public function discoNodeInfo($node = false);

  public function discoNodeMeta($node = false);

  public function discoNodeItems($node = false);
}


