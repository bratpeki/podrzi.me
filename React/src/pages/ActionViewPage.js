import React from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import NavigationBar from "../components/NavigationHeader.js";
import InfoFooter from "../components/InfoFooter.js";
import { AuthStateContext } from "../components/UseAuthState.js";
import ImageGallery from "../components/ImageGallery.js";
import { apiRequest } from "../utility/FetchAPI.js";
import { jwtDecode } from "jwt-decode";
import DonateFormModal from "../components/DonateFormModal.js";
import CommentDropdown from "../components/CommentDropdown.js";
import ReportDialog from "../components/ReportDialog.js";

function ActionViewPage() {
  const location = useLocation();
  const { id } = location.state || {};
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

  const [reportContext, setReportContext] = useState(null);

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
      setComments([]); // Osiguraj da su komentari prazni ako akcija ne uspije
    } finally {
      setLoadingAction(false);
    }
  };

  useEffect(() => {
    fetchActionData();
  }, [id]);

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
      fetchActionData(); // Ponovo dohvati SVE podatke o akciji (uključujući ažurirane komentare)
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
    setReportContext({ type: 0, id: userId }); // type 0 = user
  };

  const handleReportComment = (commentId) => {
    setReportContext({ type: 2, id: commentId }); // type 2 = comment
  };

  const handleReportAction = () => {
    setReportContext({ type: 1, id: currentAction.idAction }); // type 1 = action
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
      console.error(error.message);
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
      <div className="mt-10 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-extrabold text-gray-800 mb-2">Vlasnik</h2>
        <ul className="list-none p-0 space-y-2">
          {owner.map((o) => (
            <Link to={`/viewProfile/${o.idUser}`} state={{ id: o.idUser }}>
              <li key={o.idUser} className="flex items-center gap-3">
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
            <h2 className="text-xl font-extrabold text-gray-800 mt-4 mb-2">
              Kolaboratori
            </h2>
            <ul className="list-none p-0 space-y-2">
              {collaborators.map((c) => (
                <Link to={`/viewProfile/${c.idUser}`} state={{ id: c.idUser }}>
                  <li key={c.idUser} className="flex items-center gap-3">
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavigationBar showSearch={false} />

      <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto">
        {isOwner && (
          <Link
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded float-right"
            to={`/editAction/${id}`}
            state={{ id }}
          >
            Ažuriraj
          </Link>
        )}
        {!isOwner && (
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded float-right"
            onClick={handleReportAction}
          >
            Prijavi
          </button>
        )}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {currentAction.name}
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-3/3">
            <ImageGallery images={actionImages} />
          </div>

          <div className="md:max-w-2/3 w-2/3 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
            <div>
              <p className="text-xl font-bold text-gray-700 mb-2">
                {currentAction.collected.toLocaleString()}KM prikupljeno
              </p>
              <p className="text-sm text-gray-600 mb-4">
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
                className={`text-sm font-medium mb-4 ${
                  progress < 50 ? "text-orange-500" : "text-green-600"
                }`}
              >
                {progress}% prikupljeno
              </p>

              <p className="text-md font-medium text-gray-700 mb-6">
                👥 Broj podržavalaca:{" "}
                <span className="font-bold">{currentAction.backers || 0}</span>
              </p>
            </div>

            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded w-full"
              onClick={() => setShowDonateModal(true)}
            >
              Doniraj
            </button>
            {showCollaborations()}
          </div>
        </div>
        <p className="text-lg text-gray-700 mt-6">{currentAction.desc}</p>

        <div className="mt-10 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Komentari</h2>

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

                      <CommentDropdown
                        commentId={comment.idComment}
                        userId={comment.idUser}
                        onReportUser={handleReportUser}
                        onReportComment={handleReportComment}
                        onEditComment={() =>
                          handleEditComment(comment.idComment, comment.text)
                        }
                        onDeleteComment={handleDeleteComment}
                        /* ↓ show/hide based on author */
                        showReportUser={!isAuthor}
                        showReportComment={!isAuthor}
                        showEditComment={isAuthor}
                        showDeleteComment={isAuthor}
                      />
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
                            className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm px-4 py-1 rounded"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
              rows="3"
              placeholder="Napišite svoj komentar..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              disabled={submittingComment}
            ></textarea>
            <button
              type="submit"
              className="mt-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
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
