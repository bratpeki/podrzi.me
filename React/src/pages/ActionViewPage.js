import React from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import NavigationBar from "../components/NavigationHeader.js";
import InfoFooter from "../components/InfoFooter.js";
import { AuthStateContext } from "../components/UseAuthState.js";
import ImageGallery from "../components/ImageGallery.js";
import { apiRequest } from "../utility/FetchAPI.js";
import { jwtDecode } from "jwt-decode";
import DonateFormModal from "../components/DonateFormModal.js";
import CommentDropdown from "../components/CommentDropdown.js";
import ReportDialog from "../components/ReportDialog.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ActionViewPage() {
  const location = useLocation();
  const params = useParams();
  const stateId = location.state?.id;
  const urlId = params.id;
  const id = stateId || urlId;

  const navigate = useNavigate();
  const { authState } = useContext(AuthStateContext);
  const [currentAction, setCurrentAction] = useState(null);
  const [actionImages, setImages] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loadingAction, setLoadingAction] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [notifText, setNotifText] = useState("");
  const sweetAlert = withReactContent(Swal);

  const [reportContext, setReportContext] = useState(null);
  const [showCreateNotifModal, setShowCreateNotifModal] = useState(false);
  const [ownerCheckDone, setOwnerCheckDone] = useState(false);

  const commentAuthorId = authState.accessToken
    ? jwtDecode(authState.accessToken).id
    : null;

  const fetchActionData = async () => {
    if (!id) {
      setLoadingAction(false);
      return;
    }

    setLoadingAction(true);
    try {
      const actionData = await apiRequest(
        `actions/getaction?idAction=${id}`,
        "GET",
        authState.accessToken
      );
      setCurrentAction(actionData);
      setComments(actionData.comments || []);

      if (authState.accessToken && actionData.actionOwners) {
        const decoded = jwtDecode(authState.accessToken);
        const ownerFound = actionData.actionOwners.find(
          (owner) => owner.idUser === decoded.id
        );
        setIsOwner(!!ownerFound);
      } else {
        setIsOwner(false);
      }

      const imageData = await apiRequest(
        `images/getactionimages?idAction=${id}`,
        "GET",
        authState.accessToken
      );
      setImages(imageData);
    } catch (err) {
      console.error("Failed to fetch action details or images:", err);
      setCurrentAction(null);
      setComments([]);
    } finally {
      setLoadingAction(false);
      setOwnerCheckDone(true);
    }
  };

  useEffect(() => {
    if (id) {
      fetchActionData();
    }
  }, [id, authState.accessToken]);

  // Run owner check separately after currentAction and token are ready
  useEffect(() => {
    if (currentAction && authState.accessToken) {
      const decoded = jwtDecode(authState.accessToken);
      const ownerFound = currentAction.actionOwners?.some(
        (owner) => owner.idUser === decoded.id
      );
      setIsOwner(!!ownerFound);
    } else {
      setIsOwner(false);
    }
    setOwnerCheckDone(true);
  }, [currentAction, authState.accessToken]);

  const handleCreateNotification = async (text) => {
    if (!text.trim()) {
      await sweetAlert.fire({
        title: "Greška!",
        text: "Tekst notifikacije ne može biti prazan.",
        icon: "error",
        confirmButtonText: "U redu",
      });
      return;
    }

    try {
      const res = await apiRequest(
        "notifications/send",
        "POST",
        authState.accessToken,
        {
          idAction: currentAction.idAction,
          text: text,
        }
      );

      if (res === "success") {
        await sweetAlert.fire({
          title: "Uspješno!",
          text: "Notifikacija je poslana.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setShowCreateNotifModal(false);
        setNotifText(text);
      } else {
        throw new Error("Neuspješno slanje notifikacije.");
      }
    } catch (err) {
      console.error("Greška pri slanju notifikacije:", err);
      await sweetAlert.fire({
        title: "Greška!",
        text: err.message || "Došlo je do greške.",
        icon: "error",
        confirmButtonText: "U redu",
      });
    }
  };

  useEffect(() => {
    fetchActionData();
    if (showCreateNotifModal) {
      sweetAlert
        .fire({
          title: "Nova notifikacija",
          input: "textarea",
          inputPlaceholder: "Unesite tekst notifikacije...",
          showCancelButton: true,
          confirmButtonText: "Pošalji",
          cancelButtonText: "Otkaži",
        })
        .then((result) => {
          if (result.isConfirmed && result.value.trim()) {
            handleCreateNotification(result.value);
          } else {
            setShowCreateNotifModal(false);
          }
        });
    }
  }, [showCreateNotifModal]);

  const handleDonationSuccess = () => {
    fetchActionData();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!authState.accessToken) {
      setCommentError("Morate biti prijavljeni da biste ostavili komentar.");
      return;
    }

    if (!newCommentText.trim()) {
      setCommentError("Komentar ne može biti prazan.");
      return;
    }

    setSubmittingComment(true);

    try {
      const commentData = {
        text: newCommentText.trim(),
        idAction: currentAction.idAction,
      };

      await apiRequest(
        "comments/add",
        "POST",
        authState.accessToken,
        commentData
      );

      setNewCommentText("");
      setCommentError("");
      fetchActionData();
    } catch (err) {
      console.error("Greška pri slanju komentara:", err);
      setCommentError(
        err.message || "Došlo je do greške prilikom slanja komentara."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReportUser = (userId) => {
    setReportContext({ type: 0, id: userId });
  };

  const handleReportComment = (commentId) => {
    setReportContext({ type: 2, id: commentId });
  };

  const handleReportAction = () => {
    setReportContext({ type: 1, id: currentAction.idAction });
  };

  const confirmReport = async (reason) => {
    if (!reportContext) return;

    try {
      const res = await apiRequest(
        "reports/create",
        "POST",
        authState.accessToken,
        {
          reportType: reportContext.type,
          idReported: reportContext.id,
          text: reason,
        }
      );

      if (res !== "success") {
        throw new Error("Desila se greška prilikom kreiranja prijave.");
      }
    } catch (error) {
      await sweetAlert.fire({
        title: "Greška!",
        text: error.message,
        icon: "error",
        confirmButtonText: "U redu",
      });
    } finally {
      setReportContext(null);
    }
  };

  const handleEditComment = (commentId, currentText) => {
    setEditingId(commentId);
    setEditingText(currentText);
  };

  const saveEditedComment = async () => {
    if (!editingText.trim()) return;

    try {
      await apiRequest("comments/edit", "POST", authState.accessToken, {
        idComment: editingId,
        text: editingText,
      });
      setEditingId(null);
      setEditingText("");
      fetchActionData();
    } catch (err) {
      console.error("Greška pri izmeni komentara:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Da li ste sigurni da želite obrisati komentar?"
    );
    if (!confirmDelete) return;

    try {
      await apiRequest(
        `comments/remove`,
        "POST",
        authState.accessToken,
        commentId
      );
      fetchActionData();
    } catch (err) {
      console.error("Greška pri brisanju komentara:", err.message);
    }
  };

  if (loadingAction) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavigationBar showSearch={false} />
        <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto text-center text-gray-500">
          Učitavanje akcije...
        </main>
        <InfoFooter />
      </div>
    );
  }

  if (!currentAction) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavigationBar showSearch={false} />
        <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto text-center text-gray-500">
          Akcija nije pronađena ili je došlo do greške pri učitavanju.
        </main>
        <InfoFooter />
      </div>
    );
  }

  const progress = Math.min(
    100,
    (currentAction.collected / currentAction.goal) * 100
  ).toFixed(0);

  const showCollaborations = () => {
    if (
      !currentAction.actionOwners ||
      currentAction.actionOwners.length === 0
    ) {
      return null;
    }

    const owner = currentAction.actionOwners.filter((o) => !o.isCollab);
    const collaborators = currentAction.actionOwners.filter((o) => o.isCollab);

    return (
      <div className="mt-10 p-4 bg-white rounded shadow ">
        <h2 className="text-xl font-extrabold text-style mb-2">Vlasnik</h2>
        <ul className="list-none p-0 space-y-2">
          {owner.map((o) => (
            <Link
              to={`/viewProfile/${o.idUser}`}
              state={{ id: o.idUser }}
              key={o.idUser}
            >
              <li className="flex items-center gap-3 hover:underline drop-shadow-md">
                <img
                  src={o.imagePath}
                  alt={o.displayName}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span>{o.displayName}</span>
              </li>
            </Link>
          ))}
        </ul>
        {collaborators.length > 0 && (
          <>
            <h2 className="text-xl font-extrabold text-gray-800 mt-4 mb-2 drop-shadow-md">
              Kolaboratori
            </h2>
            <ul className="list-none p-0 space-y-2 ">
              {collaborators.map((c) => (
                <Link
                  to={`/viewProfile/${c.idUser}`}
                  state={{ id: c.idUser }}
                  key={c.idUser}
                >
                  <li className="flex items-center gap-3 hover:underline drop-shadow-md">
                    <img
                      src={c.imagePath}
                      alt={c.displayName}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span>{c.displayName}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 gradient-style">
      <NavigationBar showSearch={false} />

      <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto bg-white rounded shadow">
        <h1 className="text-4xl font-extrabold text-style text-center">
          {currentAction.name}
        </h1>

        <h1 className="text-2xl font-bold text-style mb-4 text-center">
          {currentAction.subtitle}
        </h1>
        <p className="text-md text-gray-600 mb-6 text-center">
          <span className="font-semibold">{currentAction.category}</span>
        </p>
        {ownerCheckDone && isOwner && (
          <div className="flex justify-between mb-4">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded"
              onClick={() => setShowCreateNotifModal(true)}
            >
              Kreiraj notifikaciju
            </button>
            <Link
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded"
              to={`/editAction/${id}`}
              state={{ id }}
            >
              Ažuriraj
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-3/3">
            <ImageGallery images={actionImages} />
          </div>

          <div className="md:max-w-2/3 w-2/3 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
            <div>
              <p className="text-3xl font-extrabold text-style mb-2">
                {currentAction.collected.toLocaleString()}KM prikupljeno
              </p>
              <p className="text-sm text-gray-600 mb-1">
                od ciljanih {currentAction.goal.toLocaleString()}KM
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full ${
                    progress < 50 ? "bg-orange-400" : "bg-green-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p
                className={`text-sm font-medium mb-1 ${
                  progress < 50 ? "text-orange-500" : "text-green-600"
                }`}
              >
                {progress}% prikupljeno
              </p>

              <p className="text-md font-medium text-gray-700 mb-1">
                👥 Broj podržavalaca:{" "}
                <span className="font-bold">{currentAction.backers || 0}</span>
              </p>

              <p className="text-md font-medium text-gray-700 mb-1">
                📅 Datum završetka akcije:{" "}
                <span className="font-semibold">
                  {new Date(currentAction.endTime).toLocaleDateString()}
                </span>
              </p>

              <p className="text-md font-medium text-gray-700 mb-4 flex items-center gap-1">
                🧭 Lokacija:{" "}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    currentAction.location
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 font-semibold"
                >
                  {currentAction.location || "N/A"}
                </a>
              </p>

              {currentAction.tags && currentAction.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentAction.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              className="button-style w-full mt-6"
              onClick={() => setShowDonateModal(true)}
            >
              Doniraj
            </button>

            {showCollaborations()}
          </div>
        </div>

        <div className="mt-10 p-4 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-style mb-4">OPIS</h2>
          <p className="text-lg text-gray-700 whitespace-pre-line text-left">
            {currentAction.desc}
          </p>
        </div>

        <div className="mt-10 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-style mb-4">Komentari</h2>

          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-md p-4 mb-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const isAuthor = commentAuthorId === comment.idUser;

                return (
                  <div
                    key={comment.idComment}
                    className="border-b pb-3 last:border-b-0"
                  >
                    <div className="flex items-center mb-1">
                      <Link
                        to={`/viewProfile/${comment.idUser}`}
                        state={{ id: comment.idUser }}
                        className="flex items-center mb-1 hover:underline"
                      >
                        <img
                          src={
                            comment.imagePath ||
                            "https://via.placeholder.com/30"
                          }
                          alt={comment.displayName || "Gost"}
                          className="w-7 h-7 rounded-full object-cover mr-2 hover:bg-gray-200"
                        />
                        <p className="font-semibold text-gray-800">
                          {comment.displayName || "Gost"}
                        </p>
                      </Link>
                      <span className="text-sm text-gray-500 ml-auto mr-4">
                        {new Date(comment.created).toLocaleString()}
                      </span>
                      {authState.accessToken && (
                        <CommentDropdown
                          commentId={comment.idComment}
                          userId={comment.idUser}
                          onReportUser={handleReportUser}
                          onReportComment={handleReportComment}
                          onEditComment={() =>
                            handleEditComment(comment.idComment, comment.text)
                          }
                          onDeleteComment={handleDeleteComment}
                          //komentar
                          showReportUser={!isAuthor}
                          showReportComment={!isAuthor}
                          showEditComment={isAuthor}
                          showDeleteComment={isAuthor}
                        />
                      )}
                    </div>

                    {editingId === comment.idComment ? (
                      <div className="ml-9 space-y-2">
                        <textarea
                          className="w-full p-2 border rounded resize-y"
                          rows={3}
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEditedComment}
                            className="button-style text-sm px-4 py-1 rounded"
                          >
                            Sačuvaj
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-1 rounded"
                          >
                            Otkaži
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 ml-9">{comment.text}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">
                Nema komentara. Budite prvi koji će ostaviti komentar!
              </p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-4">
            {commentError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{commentError}</span>
              </div>
            )}
            <textarea
              className={`w-full p-3 border rounded-md resize-y focus:outline-none ${
                !authState.accessToken
                  ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                  : "border-gray-300 focus:ring-2 focus:ring-cyan-500"
              }`}
              rows="3"
              placeholder="Napišite svoj komentar..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              disabled={submittingComment || !authState.accessToken}
            />

            <button
              type="submit"
              className={`mt-3 font-semibold button-style ${
                !authState.accessToken ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submittingComment || !authState.accessToken}
            >
              {submittingComment ? "Slanje..." : "Pošalji Komentar"}
            </button>
            {!authState.accessToken && (
              <p className="text-sm text-red-500 mt-2">
                Morate biti prijavljeni da biste komentarisali.
              </p>
            )}
          </form>
        </div>
        {!isOwner && authState.accessToken && (
          <div className="flex justify-end pt-4">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
              onClick={handleReportAction}
            >
              Prijavi Akciju
            </button>
          </div>
        )}
      </main>

      <InfoFooter />

      <ReportDialog
        show={reportContext !== null}
        onClose={() => setReportContext(null)}
        onConfirm={confirmReport}
      />

      {showDonateModal && currentAction && (
        <DonateFormModal
          action={currentAction}
          onClose={() => setShowDonateModal(false)}
          onDonationSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
}

export default ActionViewPage;
